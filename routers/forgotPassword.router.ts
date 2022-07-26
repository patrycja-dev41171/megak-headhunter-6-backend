import { Router } from 'express';
import { ValidationError } from '../utils/handleErrors';
import { UserRecord } from '../records/user.record';
import { pool } from '../utils/db';
import { HrUserEntity } from '../types';
import { FieldPacket } from 'mysql2';
import { StudentUserEntity } from '../types/student/student_user-entity';
import { sendEmail } from '../utils/sendEmail';

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

  const attachment = [{}];

  try {
    if (data.role === 'hr') {
      const [results] = (await pool.execute(
        'SELECT `user`.`id`, `user`.`email`, `user`.`role`, `hr`.`fullname`, `hr`.`company` FROM`hr` INNER JOIN `user` ON `hr`.`user_id` = `user`.`id` WHERE `hr`.`email` = :email',
        {
          email: data.email,
        }
      )) as HrUserRecordResult;
      const hr = results.length === 0 ? null : results[0];

      const html = `<html><head><style>h1{color:#ff6f37;}h2{color:cadetblue;}</style></head><body><h1>Witaj HR - ${hr.fullname} z firmy ${hr.company}</h1><h2>Zmiana hasła do konta.</h2><p>Aby móc ponownie zalogować się do aplikacji zmień hasło na nowe na stronie: <a href=${link}>${link}</a> </p></body></html>`;
      sendEmail(hr.email, 'HeadHunter grupa 6', html, attachment);
    } else if (data.role === 'student') {
      const [results] = (await pool.execute(
        'SELECT `user`.`id`, `user`.`email`, `user`.`role`, `student`.`firstname`,`student`.`lastname` FROM `student` INNER JOIN `user` ON `student`.`user_id`=`user`.`id`WHERE `student`.`email` = :email',
        {
          email: data.email,
        }
      )) as StudentUserRecordResult;
      const student = results.length === 0 ? null : results[0];
      const html = `<html><head><style>h1{color:#ff6f37;}h2{color:cadetblue;}</style></head><body><h1>Witaj STUDENCIE - ${student.firstname} ${student.lastname}</h1><h2>Zmiana hasła do konta.</h2><p>Aby móc ponownie zalogować się do aplikacji zmień hasło na nowe na stronie: <a href=${link}>${link}</a> </p></body></html>`;
      sendEmail(student.email, 'HeadHunter grupa 6', html, attachment);
    }
  } catch (err) {
    throw new ValidationError('Problem with sending email to user.');
  }
  res.send('OK');
});
