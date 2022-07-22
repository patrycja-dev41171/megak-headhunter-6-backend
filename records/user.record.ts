import { UserEntity } from '../types';
import { ValidationError } from '../utils/handleErrors';
import { v4 as uuid } from 'uuid';
import { FieldPacket } from 'mysql2';
import { pool } from '../utils/db';

type UserRecordResult = [UserEntity[], FieldPacket[]];

export class UserRecord implements UserEntity {
  id: string;
  email: string;
  courseCompletion: number;
  courseEngagment: number;
  projectDegree: number;
  teamProjectDegree: number;
  bonusProjectUrls: string;

  constructor(obj: UserEntity) {
    if (typeof !obj.email || obj.email.length > 127) {
      throw new ValidationError('Email nie może być pusty, ani przekraczać 127 znaków');
    }
    if (typeof obj.email !== 'string') {
      throw new ValidationError('Format wprowadzonych danych jest błędny.');
    }
    if (typeof !obj.courseCompletion) {
      throw new ValidationError('Pole wymagane');
    }
    if (typeof obj.courseCompletion !== 'number') {
      throw new ValidationError('Format wprowadzonych danych jest błędny.');
    }
    if (typeof !obj.courseEngagment) {
      throw new ValidationError('Pole wymagane');
    }
    if (typeof obj.courseEngagment !== 'number') {
      throw new ValidationError('Format wprowadzonych danych jest błędny.');
    }
    if (typeof !obj.projectDegree) {
      throw new ValidationError('Pole wymagane');
    }
    if (typeof obj.projectDegree !== 'number') {
      throw new ValidationError('Format wprowadzonych danych jest błędny.');
    }
    if (typeof !obj.teamProjectDegree) {
      throw new ValidationError('Pole wymagane');
    }
    if (typeof obj.teamProjectDegree !== 'number') {
      throw new ValidationError('Format wprowadzonych danych jest błędny.');
    }
    if (typeof !obj.bonusProjectUrls) {
      throw new ValidationError('Pole wymagane');
    }
    if (typeof obj.bonusProjectUrls !== 'string') {
      throw new ValidationError('Format wprowadzonych danych jest błędny.');
    }

    this.id = obj.id;
    this.email = obj.email;
    this.courseCompletion = obj.courseCompletion;
    this.courseEngagment = obj.courseEngagment;
    this.projectDegree = obj.projectDegree;
    this.teamProjectDegree = obj.teamProjectDegree;
    this.bonusProjectUrls = obj.bonusProjectUrls;
  }

  async insert(): Promise<void> {
    if (!this.id) {
      this.id = uuid();
    }

    const [results] = (await pool.execute(
      'INSERT INTO `users` (`id`, `email`, `courseCompletion`, `courseEngagment`, `projectDegree`, `teamProjectDegree`, `bonusProjectUrls`) VALUES (:id, ,:email :courseCompletion, :courseEngagment, :projectDegree, :teamProjectDegree, :bonusProjectUrls)',
      {
        id: this.id,
        email: this.email,
        courseCompletion: this.courseCompletion,
        courseEngagment: this.courseEngagment,
        projectDegree: this.projectDegree,
        teamProjectDegree: this.teamProjectDegree,
        bonusProjectUrls: this.bonusProjectUrls,
      }
    )) as UserRecordResult;
  }
}
