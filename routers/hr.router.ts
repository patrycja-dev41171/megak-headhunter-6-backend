import { Router } from 'express';
import { ValidationError } from '../utils/handleErrors';
import { UserRecord } from '../records/user.record';
import { HrRecord } from '../records/hr.record';

export const hrRouter = Router();

hrRouter.post('/', async (req, res) => {
  const user = {
    email: req.body.email,
    role: 'hr',
  };

  if (!user.email) {
    throw new ValidationError('Email jest wymagany ');
  }

  const addUser = new UserRecord(user);
  await addUser.insert();

  if (!req.body.fullName || !req.body.company || !req.body.maxReservedStudents) {
    throw new ValidationError('Nie podano wszystkich informacji !');
  }
  const hr = {
    ...req.body,
    user_id: addUser.id,
    users_id_list: JSON.stringify([]),
  };

  const addHr = new HrRecord(hr);
  try {
    await addHr.insert();
  } catch (err) {
    console.log(err);
  }
  res.send('Dodano HR do bazy danych');
});
