import { ValidationError } from '../utils/handleErrors';
import { v4 as uuid } from 'uuid';
import { FieldPacket } from 'mysql2';
import { pool } from '../utils/db';
import { UserEntity } from '../types';

type UserRecordResults = [UserEntity[], FieldPacket[]];

export class UserRecord implements UserEntity {
  id?: string;
  email: string;
  password?: string | null;
  role: string;
  registerToken?: string | null;

  constructor(obj: UserEntity) {
    if (!obj.email || obj.email.length > 255) {
      throw new ValidationError('Email cannot be empty and cannot exceed 255 characters.');
    }
    if (typeof obj.email !== 'string') {
      throw new ValidationError('The format of the entered data is incorrect.');
    }
    if (!obj.role) {
      throw new ValidationError('Role cannot be empty.');
    }
    // if (obj.password.length > 255) {
    //   throw new ValidationError('Password cannot be empty and cannot exceed 255 characters.');
    // }

    this.id = obj.id ?? uuid();
    this.email = obj.email;
    this.password = obj.password ?? null;
    this.role = obj.role;
    this.registerToken = obj.registerToken ?? null;
  }

  async insert(): Promise<string> {
    this.registerToken = this.registerToken ?? uuid();
    await pool.execute(
      'INSERT INTO `user` (`id`, `email`, `password`,`role`,`registerToken`)VALUES(:id,:email, :password, :role, :registerToken)',
      {
        ...this,
        registerToken: this.registerToken,
      }
    );
    return this.registerToken;
  }

  static async getOneByEmail(email: string): Promise<UserEntity> {
    const [results] = (await pool.execute('SELECT * FROM `user` WHERE `email` = :email', {
      email,
    })) as UserRecordResults;
    return results.length === 0 ? null : new UserRecord(results[0]);
  }

  static async getOneById(id: string): Promise<UserEntity> {
    const [results] = (await pool.execute('SELECT * FROM `user` WHERE `id` = :id', {
      id,
    })) as UserRecordResults;
    return results.length === 0 ? null : new UserRecord(results[0]);
  }

  static async getAll(): Promise<UserEntity[]> {
    const [results] = (await pool.execute('SELECT * FROM `user` ')) as UserRecordResults;
    return results.map(obj => new UserRecord(obj));
  }
}
