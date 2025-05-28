import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../entities/user';
import bcrypt from 'bcryptjs';
import { generateToken, verifyToken } from '../utils/jwt';
import { ILike } from 'typeorm';
import { KafkaManager } from '../events/kafka.manager';

export const registerUser = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(User);
  const { full_name, email, password } = req.body;

  const exists = await repo.findOne({ where: { email } });
  if (exists)
    return res
      .status(409)
      .json({ valid: false, message: 'Email already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = repo.create({ full_name, email, password: hashedPassword });
  await repo.save(user);

  const kafka = KafkaManager.getInstance();
  await kafka.produce('user.created', {
    full_name,
    email,
  });

  res.status(201).json({ message: 'User created' });
};

export const loginUser = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(User);
  const { email, password } = req.body;

  const user = await repo.findOne({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res
      .status(401)
      .json({ valid: false, message: 'Invalid credentials' });
  }

  const accessToken = generateToken({ id: user.id, role: user.role });
  const refreshToken = generateToken({ id: user.id });

  res.json({ accessToken, refreshToken });
};

export const refreshToken = (req: Request, res: Response) => {
  try {
    const decoded = verifyToken(req.body.refreshToken);
    const accessToken = generateToken({
      id: decoded['id'],
      role: decoded['role'],
    });
    res.json({ accessToken });
  } catch {
    res.status(403).json({ error: 'Invalid refresh token' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(User);
  const user = await repo.findOneBy({ id: req.user.id });
  if (!user) return res.status(404).json({ message: 'User not found' });

  repo.merge(user, req.body);
  await repo.save(user);
  res.json({ message: 'User updated' });
};

export const listUsers = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(User);
  const { search = '', role, page = 1, limit = 10 } = req.query;

  const where = {
    ...(search ? { full_name: ILike(`%${search}%`) } : {}),
    ...(role ? { role: role as 'user' } : {}),
  };

  const [users, total] = await repo.findAndCount({
    where,
    skip: (+page - 1) * +limit,
    take: +limit,
    order: { createdAt: 'DESC' },
  });

  res.json({
    users,
    meta: {
      total,
      page: +page,
      limit: +limit,
      pages: Math.ceil(total / +limit),
    },
  });
};

export const deleteUser = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(User);
  const targetId = req.params.id;

  if (req.user.role !== 'admin' && req.user.id !== targetId) {
    return res.status(403).json({ messsage: 'Not authorized' });
  }

  await repo.delete(targetId);
  res.status(204).json({ message: 'User deleted' });
};
