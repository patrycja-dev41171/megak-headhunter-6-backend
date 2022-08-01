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
      throw new ValidationError('Pole Email nie może być puste oraz zawierać więcej niż 255 znaków !.');
    }
    if (typeof obj.email !== 'string') {
      throw new ValidationError('Format danych pola E-mail jest nieprawdiłowy !.');
    }
    if (!obj.role) {
      throw new ValidationError('Pole Role nie może być puste !.');
    }
    if (obj.password !== null && obj.password !== undefined && obj.password.length > 255) {
      throw new ValidationError('Pole Hasło nie może być puste oraz zawierać więcej niż 255 znaków !.');
    }

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

  static async updatePassword(id: string, password: string): Promise<void> {
    await pool.execute('UPDATE `user` SET `password` = :password WHERE `id` = :id', {
      id,
      password,
    });
  }

  static async updateOneRegister(password: string, id: string, registerToken: string | null): Promise<void> {
    await pool.execute('UPDATE`user`SET`password`=:password, `registerToken`= :registerToken WHERE`id`=:id', {
      password: password,
      registerToken: null,
      id: id,
    });
  }
}
