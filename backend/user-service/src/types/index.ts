export interface IUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'customer' | 'admin';
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'customer' | 'admin';
}
