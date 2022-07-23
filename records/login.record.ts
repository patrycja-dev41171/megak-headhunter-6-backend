import 'dotenv/config';
import { pool } from '../utils/db';
import { v4 as uuid } from 'uuid';
import { FieldPacket } from 'mysql2';
import { Login, LoginCreated } from '../types';
import jwt from 'jsonwebtoken';

type LoginResults = [Login[], FieldPacket[]];

export class LoginRecord implements Login {
  id?: string;
  user_id: string;
  refreshToken: string;

  constructor(obj: Login) {
    this.id = obj.id ?? uuid();
    this.user_id = obj.user_id;
    this.refreshToken = obj.refreshToken;
  }

  async insert() {
    await pool.execute('INSERT INTO `login`(`id`, `user_id`, `refreshToken`)VALUES(:id,:user_id,:refreshToken)', this);
  }

  static async getOneByToken(refreshToken: string): Promise<Login> {
    const [results] = (await pool.execute('SELECT * FROM `login` WHERE`refreshToken` =:refreshToken', refreshToken)) as LoginResults;
    return results.length === 0 ? null : results[0];
  }

  static async deleteOneByToken(refreshToken: string): Promise<void> {
    await pool.execute('DELETE FROM `login` WHERE `refreshToken` = :refreshToken', refreshToken);
  }

  static createTokens(payload: string): LoginCreated {
    const token = jwt.sign({ id: payload }, process.env.ACCESS_TOKEN_KEY, {
      expiresIn: '10min',
    });
    const refreshToken = jwt.sign({ id: payload }, process.env.ACCESS_REFRESH_TOKEN_KEY, { expiresIn: '24h' });
    return {
      id: payload,
      token,
      refreshToken,
    };
  }
}
