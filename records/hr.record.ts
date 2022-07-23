import { HrEntity } from '../types';
import { ValidationError } from '../utils/handleErrors';
import { v4 as uuid } from 'uuid';
import { FieldPacket } from 'mysql2';
import { pool } from '../utils/db';

type HrRecordResult = [HrEntity[], FieldPacket[]];

export class UserRecord implements HrEntity {
  id: string;
  email: string;
  fullName: string;
  company: string;
  maxReservedStudents: number;

  constructor(obj: HrEntity) {
    if (typeof !obj.email || obj.email.length > 255) {
      throw new ValidationError('Email cannot be empty and cannot exceed 255 characters.');
    }
    if (typeof obj.email !== 'string') {
      throw new ValidationError('The format of the entered data is incorrect.');
    }
    if (typeof !obj.fullName || obj.fullName.length > 50) {
      throw new ValidationError('Full name cannot be empty and cannot exceed 50 characters.');
    }
    if (typeof obj.fullName !== 'string') {
      throw new ValidationError('The format of the entered data is incorrect.');
    }
    if (typeof !obj.company || obj.company.length > 120) {
      throw new ValidationError('Company name cannot be empty and cannot exceed 120 characters.');
    }
    if (typeof obj.company !== 'string') {
      throw new ValidationError('The format of the entered data is incorrect.');
    }
    if (typeof !obj.maxReservedStudents || obj.maxReservedStudents > 999) {
      throw new ValidationError('Number of reserved students cannot be empty and cannot exceed 999.');
    }
    if (typeof obj.maxReservedStudents !== 'number') {
      throw new ValidationError('The format of the entered data is incorrect.');
    }

    this.id = obj.id;
    this.email = obj.email;
    this.fullName = obj.fullName;
    this.company = obj.company;
    this.maxReservedStudents = obj.maxReservedStudents;
  }

  async insert(): Promise<void> {
    if (!this.id) {
      this.id = uuid();
    }

    const [results] = (await pool.execute(
      'INSERT INTO `hr` (`id`, `email`, `fullName`, `company`, `maxReservedStudents`) VALUES (:id, ,:email :fullName, :company, :maxReservedStudents)',
      {
        id: this.id,
        email: this.email,
        fullName: this.fullName,
        company: this.company,
        maxReservedStudents: this.maxReservedStudents,
      }
    )) as HrRecordResult;
  }
}
