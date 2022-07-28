import { Router } from 'express';
import { ValidationError } from '../utils/handleErrors';
import { UserRecord } from '../records/user.record';
import { pool } from '../utils/db';
import { HrUserEntity } from '../types';
import { FieldPacket } from 'mysql2';
import { StudentUserEntity } from '../types/student/student_user-entity';
import { sendEmail } from '../utils/sendEmail';
import { emailToHr } from '../utils/emails/email-forgotPassword-hr';
import { emailToStudent } from '../utils/emails/email-forgotPassword-student';
import {emailAttachment} from "../utils/emails/email-attachment";

export const forgotPasswordRouter = Router().post('/', async (req, res) => {
  const { email, confirmEmail } = req.body;

  if (email !== confirmEmail) {
    throw new ValidationError('Invalid data.');
  }

  const data = await UserRecord.getOneByEmail(email);
  if (!data) {
    throw new ValidationError('Email is invalid. The user with this e-mail does not exist.');
  }

  const link = `http://localhost:3000/change-password/:${data.id}`;

  type HrUserRecordResult = [HrUserEntity[], FieldPacket[]];
  type StudentUserRecordResult = [StudentUserEntity[], FieldPacket[]];

  const attachment = emailAttachment();

  try {
    if (data.role === 'hr') {
      const [results] = (await pool.execute(
        'SELECT `user`.`id`, `user`.`email`, `user`.`role`, `hr`.`fullName`, `hr`.`company` FROM`hr` INNER JOIN `user` ON `hr`.`user_id` = `user`.`id` WHERE `hr`.`email` = :email',
        {
          email: data.email,
        }
      )) as HrUserRecordResult;
      const hr = results.length === 0 ? null : results[0];
      const html = emailToHr(hr, link);
      sendEmail(hr.email, 'MegaK - HeadHunter#6', html, attachment);
    } else if (data.role === 'student') {
      const [results] = (await pool.execute(
        'SELECT `user`.`id`, `user`.`email`, `user`.`role`, `student`.`firstname`,`student`.`lastname` FROM `student` INNER JOIN `user` ON `student`.`user_id`=`user`.`id`WHERE `student`.`email` = :email',
        {
          email: data.email,
        }
      )) as StudentUserRecordResult;
      const student = results.length === 0 ? null : results[0];
      const html = emailToStudent(student, link);
      sendEmail(student.email, 'MegaK - HeadHunter#6', html, attachment);
    }
  } catch (err) {
    throw new ValidationError('Problem with sending email to user.');
  }
  res.json({
    message: 'Email has been sent correctly.',
  });
});
