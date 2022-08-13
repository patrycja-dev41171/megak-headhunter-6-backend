import { ValidationError } from '../utils/handleErrors';
import { v4 as uuid } from 'uuid';
import { HrStudentEntity } from '../types';
import { pool } from '../utils/db';
import { FieldPacket } from 'mysql2';

type HrStudentResults = [HrStudentEntity[], FieldPacket[]];

export class HrStudentRecord implements HrStudentEntity {
  id?: string;
  hr_id: string;
  student_id: string;
  reservedTo: Date;

  constructor(obj: HrStudentEntity) {
    if (!obj.hr_id) {
      throw new ValidationError('Pole hr_id nie może być puste!');
    }
    if (!obj.student_id) {
      throw new ValidationError('Pole student_id nie może być puste!');
    }

    this.id = obj.id ?? uuid();
    this.hr_id = obj.hr_id;
    this.student_id = obj.student_id;
    this.reservedTo = obj.reservedTo;
  }

  async insertOne(): Promise<void> {
    await pool.execute(
      'INSERT INTO `hr_student` (`id`, `hr_id`, `student_id`,`reservedTo`)VALUES(:id,:hr_id, :student_id, :reservedTo)',
      this
    );
  }

  static async getAllByHrId(hr_id: string): Promise<HrStudentEntity[]> {
    const [results] = (await pool.execute('SELECT * FROM `hr_student` WHERE `hr_id` = :hr_id ', {
      hr_id,
    })) as HrStudentResults;
    return results.length === 0 ? null : results.map(obj => new HrStudentRecord(obj));
  }

  static async getOneByHrIdAndStudentId(hr_id: string, student_id: string): Promise<HrStudentEntity> {
    const [results] = (await pool.execute('SELECT * FROM `hr_student` WHERE `hr_id` = :hr_id AND student_id = :student_id', {
      hr_id,
      student_id,
    })) as HrStudentResults;
    return results.length === 0 ? null : new HrStudentRecord(results[0]);
  }

  static async deleteOneById(id: string): Promise<void> {
    await pool.execute('DELETE FROM `hr_student` WHERE `id` = :id', {
      id,
    });
  }

  static async deleteManyByStudentId(student_id: string): Promise<void> {
    await pool.execute('DELETE FROM `hr_student` WHERE `student_id` = :student_id', {
      student_id: student_id,
    });
  }
}
