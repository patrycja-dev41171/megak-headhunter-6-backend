import { Router } from 'express';
import { ValidationError } from '../utils/handleErrors';
import { pool } from '../utils/db';
import { studentEntityFront } from '../types';
import { FieldPacket } from 'mysql2';

export const getStudentData = Router();
type SignleStudentAllData = [studentEntityFront[], FieldPacket[]];

getStudentData.get('/:userId', async (req, res) => {
  if (!req.params.userId) {
    throw new ValidationError('Nie przekazano user_id !');
  }

  const [result] = (await pool.execute(
    'SELECT `student`.`courseCompletion`, `student`.`courseEngagement`, `student`.`projectDegree`,`student`.`teamProjectDegree`,`student`.`bonusProjectUrls`,`student`.`tel`,`student`.`firstName`, `student`.`lastName`, `student`.`githubUserName`, `student`.`portfolioUrls`, `student`.`projectUrls`, `student`.`bio`,`student`.`expectedTypeWork`, `student`.`targetWorkCity`, `student`.`expectedContractType`, `student`.`expectedSalary`, `student`.`canTakeApprenticeship`, `student`.`monthsOfCommercialExp`, `student`.`education`, `student`.`workExperience`, `student`.`courses`, `student`.`status`, `user`.`email` FROM `user` INNER JOIN `student` on `user`.`id` = `student`.`user_id` WHERE `user`.`id` = :id',
    {
      id: req.params.userId,
    }
  )) as SignleStudentAllData;

  const data = result.length === 0 ? null : result[0];
  if (!data) {
    throw new ValidationError('Nie znaleziono danych o kursancie !');
  }

  res.status(200).json(data);
});
