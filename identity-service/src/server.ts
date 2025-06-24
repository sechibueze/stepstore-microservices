import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'dotenv/config';
import { AppDataSource } from './config/database';
import { KafkaManager } from './events/kafka.manager';
import authRoutes from './routes/auth.route';
import { responseHandler } from './middlewares/response.middleware';
import requestLogger from './middlewares/logger.middleware';
import { ResponseBuilder } from './utils/response.builder';
import logger from './utils/logger';

const kafkaConfig = {
  clientId: 'identity-service',
  brokers: ['kafka:9092'], // Should match your Docker Kafka setup
  groupId: 'identity-group',
};

const app: Application = express();
const port = +process.env.PORT || 4001;
declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: string };
    }
    interface Response {
      respondWith: ResponseBuilder;
    }
  }
}
app.use(requestLogger);
app.use(helmet());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(responseHandler);
const healthCheckHandler = (_req: Request, res: Response) => {
  res.status(200).json({ msg: 'Identify Service Running' });
};
app.get('/health', healthCheckHandler);
app.use('/', authRoutes);

const start = async () => {
  try {
    console.log('is kafka', process.env.KAFKA_ENABLED);
    await AppDataSource.initialize();
    logger.info('✅ DB connected');

    // if (process.env.KAFKA_ENABLED === 'true') {
    const kafka = KafkaManager.getInstance(kafkaConfig);
    await kafka.connectProducer();
    // await kafka.connectConsumer(kafkaConfig.groupId);
    // await kafka.subscribe('user-created', async (msg) => {
    //   msg;
    // });
    // }

    app.listen(port, '0.0.0.0', () => {
      // app.listen(port, () => {
      console.log(`Identify Service running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Startup Error:', err);
  }
};

start();
