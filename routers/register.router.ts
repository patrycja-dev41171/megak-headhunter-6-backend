import { Router } from 'express';
import { ValidationError } from '../utils/handleErrors';
import { UserRecord } from '../records/user.record';
import { hashPassword } from '../utils/bcrypt-functions';
import { emailAttachment } from '../utils/emails/email-attachment';
import { emailCorrectRegistration } from '../utils/emails/email-correct-registration';
import { sendEmail } from '../utils/sendEmail';

export const registerRouter = Router().post('/:id/:registerToken', async (req, res) => {
  const { id, registerToken } = req.params;
  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    throw new ValidationError('Niepoprawne dane!');
  }
  if (password.length < 8) {
    throw new ValidationError('Hasło powinno zawierać minimum 8 znaków.');
  }

  const user = await UserRecord.getOneById(id);
  if (!user) {
    throw new Error('Użytkownik nie istnieje!');
  }

  const hash = hashPassword(password);

  try {
    await UserRecord.updateOneRegister(hash, id, registerToken);
    const attachment = emailAttachment();
    const html = emailCorrectRegistration(user.email);
    sendEmail(user.email, 'MegaK - HeadHunter#6', html, attachment);
  } catch (err) {
    throw new ValidationError('Nie można zarejestrować użytkownika!');
  }

  res.json('Użytkownik zarejestrowany pomyślnie!');
});
