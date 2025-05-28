import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { AppDataSource } from './config/database';
import authRoute from './routes/auth.route';
dotenv.config();

const app: Application = express();
const port = +process.env.PORT || 4001;

app.use(helmet());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
const healthCheckHandler = (_req: Request, res: Response) => {
  res.status(200).json({ msg: 'Identify Service Running' });
};
// app.use('/', authRoute);
app.get('/', healthCheckHandler);

const start = async () => {
  try {
    await AppDataSource.initialize();
    console.log('✅ DB connected');

    // await connectProducer();
    // console.log('✅ Kafka Producer connected');

    app.listen(port, '0.0.0.0', () => {
      console.log(`🚀 Identify Service running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error('❌ Startup Error:', err);
  }
};

start();
