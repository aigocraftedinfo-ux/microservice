import bcrypt from 'bcryptjs';
import { IUser } from '../types/index.js';

class UserStore {
  private users: IUser[] = [];

  constructor() {
    this.seedDefaultUsers();
  }

  private seedDefaultUsers() {
    const adminPasswordHash = bcrypt.hashSync('admin123', 10);
    const userPasswordHash = bcrypt.hashSync('user123', 10);

    this.users = [
      {
        id: 'usr_admin_001',
        name: 'Amazon Admin',
        email: 'admin@amazon.com',
        passwordHash: adminPasswordHash,
        role: 'admin',
        phone: '+1-800-555-0199',
        address: {
          street: '410 Terry Ave N',
          city: 'Seattle',
          state: 'WA',
          zipCode: '98109',
          country: 'USA',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'usr_cust_001',
        name: 'John Doe',
        email: 'john@example.com',
        passwordHash: userPasswordHash,
        role: 'customer',
        phone: '+1-555-0142',
        address: {
          street: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  public getAll(): IUser[] {
    return this.users;
  }

  public findById(id: string): IUser | undefined {
    return this.users.find((u) => u.id === id);
  }

  public findByEmail(email: string): IUser | undefined {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public add(user: IUser): IUser {
    this.users.push(user);
    return user;
  }

  public update(id: string, updates: Partial<Omit<IUser, 'id' | 'passwordHash'>>): IUser | undefined {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return undefined;
    this.users[index] = {
      ...this.users[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.users[index];
  }

  public delete(id: string): boolean {
    const initialLen = this.users.length;
    this.users = this.users.filter((u) => u.id !== id);
    return this.users.length < initialLen;
  }
}

export const userStore = new UserStore();
