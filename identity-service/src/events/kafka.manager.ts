import {
  Kafka,
  Producer,
  Consumer,
  EachMessagePayload,
  logLevel,
} from 'kafkajs';

interface KafkaConfig {
  clientId: string;
  brokers: string[];
  groupId: string;
}

export class KafkaManager {
  private static instance: KafkaManager;
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer | null = null;
  private isConnected: boolean = false;

  private constructor(config: KafkaConfig) {
    this.kafka = new Kafka({
      clientId: config.clientId,
      brokers: config.brokers,
      logLevel: logLevel.INFO,
    });
    this.producer = this.kafka.producer();
  }

  public static getInstance(config?: KafkaConfig): KafkaManager {
    if (!KafkaManager.instance) {
      if (!config) {
        throw new Error(
          'KafkaManager not initialized. Provide config at first call.'
        );
      }
      KafkaManager.instance = new KafkaManager(config);
    }
    return KafkaManager.instance;
  }

  public async connectProducer() {
    if (!this.isConnected) {
      await this.producer.connect();
      this.isConnected = true;
      console.log('Kafka producer connected');
    }
  }

  public async produce(topic: string, message: object) {
    if (!this.isConnected) {
      await this.connectProducer();
    }

    try {
      await this.producer.send({
        topic,
        messages: [{ value: JSON.stringify(message) }],
      });
      console.log(`Produced message to topic ${topic}`, message);
    } catch (err) {
      console.error('Error producing message:', err);
      throw err;
    }
  }

  public async connectConsumer(groupId: string) {
    if (this.consumer) {
      return; // Already connected
    }

    this.consumer = this.kafka.consumer({ groupId });
    await this.consumer.connect();
    console.log('Kafka consumer connected');
  }

  public async subscribe(
    topic: string,
    handler: (message: any) => Promise<void>
  ) {
    if (!this.consumer) {
      throw new Error('Consumer not connected. Call connectConsumer first.');
    }

    await this.consumer.subscribe({ topic, fromBeginning: false });

    await this.consumer.run({
      eachMessage: async ({
        topic,
        partition,
        message,
      }: EachMessagePayload) => {
        try {
          const parsed = message.value
            ? JSON.parse(message.value.toString())
            : null;
          await handler(parsed);
        } catch (error) {
          console.error('Error handling Kafka message:', error);
        }
      },
    });

    console.log(`Subscribed to topic ${topic}`);
  }

  public async disconnect() {
    if (this.consumer) {
      await this.consumer.disconnect();
      this.consumer = null;
    }
    if (this.isConnected) {
      await this.producer.disconnect();
      this.isConnected = false;
    }
    console.log('Kafka disconnected');
  }
}
