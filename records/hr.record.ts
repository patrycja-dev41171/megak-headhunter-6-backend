import { HrEntity } from '../types';
import { ValidationError } from '../utils/handleErrors';
import { v4 as uuid } from 'uuid';
import { FieldPacket } from 'mysql2';
import { pool } from '../utils/db';

type HrRecordResult = [HrEntity[], FieldPacket[]];

export class HrRecord implements HrEntity {
  id?: string;
  user_id: string;
  email: string;
  fullName: string;
  company: string;
  maxReservedStudents: number;
  users_id_list?: string | null;
  img_src: null | string;

  constructor(obj: HrEntity) {
    if (!obj.user_id) {
      throw new ValidationError(' Pole User_id nie może być puste!');
    }
    if (!obj.email || obj.email.length > 255) {
      throw new ValidationError('Pole e-mail nie może być puste oraz nie może przekracać 255 znaków!');
    }
    if (typeof obj.email !== 'string') {
      throw new ValidationError('Format danych pola E-mail jest nieprawidłowy!');
    }
    if (!obj.fullName || obj.fullName.length > 50) {
      throw new ValidationError('Pole Imię nie może być puste oraz przekracać 50 znaków!');
    }
    if (typeof obj.fullName !== 'string') {
      throw new ValidationError('Format danych pola Imię jest nieprawidłowy!');
    }
    if (!obj.company || obj.company.length > 120) {
      throw new ValidationError('Pole Firma nie może być puste oraz nie może przekracać 120 znaków!');
    }
    if (typeof obj.company !== 'string') {
      throw new ValidationError('Format danych pola Firma jest nieprawidłowy!');
    }
    if (!obj.maxReservedStudents || obj.maxReservedStudents > 999) {
      throw new ValidationError('Pole Maksymalna liczba studentów nie może być puste oraz nie może przekracać 999 znaków!');
    }
    if (typeof obj.maxReservedStudents !== 'number') {
      throw new ValidationError('Format danych pola Maksymalna liczba studentów jest nieprawidłowy!');
    }

    this.id = obj.id ?? uuid();
    this.user_id = obj.user_id;
    this.fullName = obj.fullName;
    this.email = obj.email;
    this.company = obj.company;
    this.maxReservedStudents = obj.maxReservedStudents;
    this.users_id_list = obj.users_id_list ?? null;
    this.img_src = obj.img_src ?? null;
  }

  async insert(): Promise<void> {
    try {
      await pool.execute(
        'INSERT INTO `hr` (`id`, `user_id`,`fullName`,`email`, `company`, `maxReservedStudents`,' +
          ' `users_id_list`, `img_src`)' +
          ' VALUES (:id, :user_id , :fullName, :email, :company, :maxReservedStudents,' +
          ' :users_id_list, :img_src)',
        this
      );
    } catch (err) {
      console.log(err);
    }
  }

  static async getOneByEmail(email: string): Promise<HrEntity> {
    const [results] = (await pool.execute('SELECT * FROM `hr` WHERE `email` = :email', {
      email,
    })) as HrRecordResult;
    return results.length === 0 ? null : new HrRecord(results[0]);
  }

  static async getOneByUserId(user_id: string): Promise<HrEntity> {
    const [results] = (await pool.execute('SELECT * FROM `hr` WHERE `user_id` = :user_id', {
      user_id: user_id,
    })) as HrRecordResult;
    return results.length === 0 ? null : new HrRecord(results[0]);
  }

  static async addImgById(id: string, img_src: string): Promise<void> {
    await pool.execute('UPDATE `hr` SET `img_src` = :img_src WHERE `user_id` = :id', {
      id: id,
      img_src: img_src,
    });
  }

  static async updateUsersIdList(id: string, users_id_list: string[]): Promise<void> {
    const array = JSON.stringify(users_id_list);
    await pool.execute('UPDATE `hr` SET `users_id_list` = :users_id_list WHERE `user_id` = :id', {
      id: id,
      users_id_list: array,
    });
  }
}
