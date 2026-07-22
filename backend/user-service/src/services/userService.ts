import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { userStore } from '../models/userStore.js';
import { IUser } from '../types/index.js';
import { generateToken } from '../utils/jwt.js';

export class UserService {
  public async register(data: { name: string; email: string; password: string; role?: 'customer' | 'admin'; phone?: string; address?: any }) {
    const existing = userStore.findByEmail(data.email);
    if (existing) {
      const err: any = new Error('User with this email already exists');
      err.statusCode = 409;
      throw err;
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const newUser: IUser = {
      id: `usr_${uuidv4().substring(0, 8)}`,
      name: data.name,
      email: data.email.toLowerCase(),
      passwordHash,
      role: data.role || 'customer',
      phone: data.phone,
      address: data.address,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    userStore.add(newUser);
    const token = generateToken({ userId: newUser.id, email: newUser.email, role: newUser.role });

    const { passwordHash: _, ...safeUser } = newUser;
    return { user: safeUser, token };
  }

  public async login(data: { email: string; password: string }) {
    const user = userStore.findByEmail(data.email);
    if (!user) {
      const err: any = new Error('Invalid email or password');
      err.statusCode = 401;
      throw err;
    }

    const isMatch = await bcrypt.compare(data.password, user.passwordHash);
    if (!isMatch) {
      const err: any = new Error('Invalid email or password');
      err.statusCode = 401;
      throw err;
    }

    const token = generateToken({ userId: user.id, email: user.email, role: user.role });
    const { passwordHash: _, ...safeUser } = user;

    return { user: safeUser, token };
  }

  public getProfile(userId: string) {
    const user = userStore.findById(userId);
    if (!user) {
      const err: any = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }
    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  }

  public updateProfile(userId: string, updates: { name?: string; phone?: string; address?: any }) {
    const updated = userStore.update(userId, updates);
    if (!updated) {
      const err: any = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }
    const { passwordHash: _, ...safeUser } = updated;
    return safeUser;
  }

  public deleteProfile(userId: string) {
    const success = userStore.delete(userId);
    if (!success) {
      const err: any = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }
    return { message: 'User account deleted successfully' };
  }

  public getAllUsers() {
    return userStore.getAll().map(({ passwordHash, ...user }) => user);
  }
}

export const userService = new UserService();
