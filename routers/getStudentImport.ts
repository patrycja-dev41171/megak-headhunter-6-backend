import { Router } from 'express';
import { pool } from '../utils/db';
import { FieldPacket } from 'mysql2';
import { SingleStudentImport } from '../types';
import { ValidationError } from '../utils/handleErrors';

export const getStudentRouter = Router();

type SingleStudentEntity = [SingleStudentImport[], FieldPacket[]];

getStudentRouter.get('/:userId', async (req, res) => {
  if (!req.params.userId) {
    throw new ValidationError('Nie otrzymano id!');
  }
  const [result] = (await pool.execute(
    'SELECT `student`.`courseCompletion`, `student`.`courseEngagement`, `student`.`projectDegree`, `student`.`teamProjectDegree`, `student`.`bonusProjectUrls`,`user`.`email` FROM `user` INNER JOIN `student` on `user`.`id` = `student`.`user_id` WHERE `user`.`id` = :id',
    {
      id: req.params.userId,
    }
  )) as SingleStudentEntity;
  const data = result.length === 0 ? null : result[0];
  if (data === null || data === undefined) {
    throw new ValidationError('Nie udało się odszukać danych o studencie!');
  }
  res.status(200).json(data);
});
