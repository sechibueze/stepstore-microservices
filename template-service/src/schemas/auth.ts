const { z } = require('zod');

export const registerSchema = z.object({
  full_name: z
    .string({ required_error: 'Full name is required' })
    .min(2, { message: 'Full name must be at least 2 characters' }),

  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Please enter a valid email address' }),

  password: z
    .string({ required_error: 'Password is required' })
    .min(6, { message: 'Password must be at least 6 characters' }),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Invalid email format' }),

  password: z.string({ required_error: 'Password is required' }),
});

export const updateUserSchema = z.object({
  full_name: z
    .string()
    .min(2, { message: 'Full name must be at least 2 characters' })
    .optional(),

  email: z.string().email({ message: 'Invalid email format' }).optional(),
});
