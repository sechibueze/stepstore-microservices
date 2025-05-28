import { Kafka } from 'kafkajs';
import { APP_CONFIG } from '../config/constant';

const kafka = new Kafka({
  clientId: 'identify-service',
  brokers: [APP_CONFIG.KAFKA_BROKER!],
});

const producer = kafka.producer();

export const connectProducer = async () => {
  await producer.connect();
};

export const publishUserCreated = async (user: {
  id: string;
  email: string;
  fullName: string;
}) => {
  await producer.send({
    topic: 'user.created',
    messages: [
      {
        key: user.id,
        value: JSON.stringify(user),
      },
    ],
  });
};
