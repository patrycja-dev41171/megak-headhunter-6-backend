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
  users_id_list?: string[] | [];

  constructor(obj: HrEntity) {
    if (!obj.user_id) {
      throw new ValidationError('User_id cannot be empty.');
    }
    if (!obj.email || obj.email.length > 255) {
      throw new ValidationError('Email cannot be empty and cannot exceed 255 characters.');
    }
    if (typeof obj.email !== 'string') {
      throw new ValidationError('The format of the entered data is incorrect.');
    }
    if (!obj.fullName || obj.fullName.length > 50) {
      throw new ValidationError('Full name cannot be empty and cannot exceed 50 characters.');
    }
    if (typeof obj.fullName !== 'string') {
      throw new ValidationError('The format of the entered data is incorrect.');
    }
    if (!obj.company || obj.company.length > 120) {
      throw new ValidationError('Company name cannot be empty and cannot exceed 120 characters.');
    }
    if (typeof obj.company !== 'string') {
      throw new ValidationError('The format of the entered data is incorrect.');
    }
    if (!obj.maxReservedStudents || obj.maxReservedStudents > 999) {
      throw new ValidationError('Number of reserved students cannot be empty and cannot exceed 999.');
    }
    if (typeof obj.maxReservedStudents !== 'number') {
      throw new ValidationError('The format of the entered data is incorrect.');
    }

    this.id = obj.id ?? uuid();
    this.user_id = obj.user_id;
    this.fullName = obj.fullName;
    this.email = obj.email;
    this.company = obj.company;
    this.maxReservedStudents = obj.maxReservedStudents;
    this.users_id_list = obj.users_id_list ?? [];
  }

  async insert(): Promise<void> {
    try {
      await pool.execute(
        'INSERT INTO `hr` (`id`, `user_id`,`fullName`,`email`, `company`, `maxReservedStudents`, `users_id_list`)' +
          ' VALUES (:id, :user_id , :fullName, :email, :company, :maxReservedStudents, :users_id_list)',
        this
      );
    } catch (err) {
      console.log(err);
    }
  }
}
