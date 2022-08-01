import { Router } from 'express';
import { ValidationError } from '../utils/handleErrors';
import { UserRecord } from '../records/user.record';
import { HrRecord } from '../records/hr.record';
import { sendEmail } from '../utils/sendEmail';
import { emailToHrRegister } from '../utils/emails/email-register-hr';
import { emailAttachment } from '../utils/emails/email-attachment';

export const hrRouter = Router();

hrRouter.post('/', async (req, res) => {
  const user = {
    email: req.body.email,
    role: 'hr',
  };

  if (!user.email) {
    throw new ValidationError('Email jest wymagany!');
  }
  if (await UserRecord.getOneByEmail(req.body.email)) {
    throw new ValidationError('Użytkownik o takim emailu juz istnieje!');
  }
  const addUser = new UserRecord(user);
  const tokenRegister = await addUser.insert();

  if (!req.body.fullName || !req.body.company || !req.body.maxReservedStudents) {
    throw new ValidationError('Nie podano wszystkich informacji!');
  }

  const hr = {
    ...req.body,
    user_id: addUser.id,
    users_id_list: JSON.stringify([]),
  };

  const attachment = emailAttachment();

  const addHr = new HrRecord(hr);

  try {
    await addHr.insert();
    const link = `http://localhost:3000/register/${addUser.id}/${tokenRegister}`;
    const html = emailToHrRegister(addHr, link);
    sendEmail(addHr.email, 'MegaK - HeadHunter#6', html, attachment);
  } catch (err) {
    console.log(err);
  }
  res.json('Dodano HR do bazy danych.');
});
