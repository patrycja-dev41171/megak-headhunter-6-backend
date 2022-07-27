import { Router } from 'express';
import { ValidationError } from '../utils/handleErrors';
import { UserRecord } from '../records/user.record';
import { HrRecord } from '../records/hr.record';
import { sendEmail } from '../utils/sendEmail';

export const hrRouter = Router();

hrRouter.post('/', async (req, res) => {
  const user = {
    email: req.body.email,
    role: 'hr',
  };

  if (!user.email) {
    throw new ValidationError('Email jest wymagany');
  }
  if (await UserRecord.getOneByEmail(req.body.email)) {
    throw new ValidationError('Uzytkownik o takim Emailu juz istnieje !');
  }

  const addUser = new UserRecord(user);
  const tokenRegister = await addUser.insert();

  if (!req.body.fullName || !req.body.company || !req.body.maxReservedStudents) {
    throw new ValidationError('Nie podano wszystkich informacji !');
  }

  const hr = {
    ...req.body,
    user_id: addUser.id,
    users_id_list: JSON.stringify([]),
  };

  const attachment = [
    {
      filename: 'unique@kreata.png',
      path: './assets/unique@kreata.png',
      cid: 'unique@kreata.png',
    },
  ];

  const addHr = new HrRecord(hr);

  try {
    await addHr.insert();
    const link = `http://localhost:3000/register/${addUser.id}/${tokenRegister}`;
    const html = `<html><head><style>h1{color:#ff6f37;}h2{color:cadetblue;}</style></head><body><h1>Witaj ${addHr.fullName} </h1><h2>Zapraszamy do rejestracji :)</h2><p>Aby zakończyć rejestracje proszę kliknij w link: <a href=${link}>${link}</a> </p><img src="cid:unique@kreata.png" alt="asda"></body></html>`;
    sendEmail(addHr.email, 'HeadHunter grupa 6', html, attachment);
  } catch (err) {
    console.log(err);
  }
  res.json({
    message: 'Dodano HR do bazy danych.',
  });
});
