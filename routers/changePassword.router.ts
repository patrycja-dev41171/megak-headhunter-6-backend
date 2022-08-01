import { Router } from 'express';
import { ValidationError } from '../utils/handleErrors';
import { UserRecord } from '../records/user.record';
import { hashPassword } from '../utils/bcrypt-functions';
import { emailAttachment } from '../utils/emails/email-attachment';
import { sendEmail } from '../utils/sendEmail';
import { emailCorrectChangePassword } from '../utils/emails/email-correct-change-password';

export const changePasswordRouter = Router().post('/:id', async (req, res) => {
  const { password, confirmPassword } = req.body;
  const { id } = req.params;
  if (password.length < 8) {
    throw new ValidationError("Hasło musi mieć przynajmniej 8 znaków.")
  }

  if (password !== confirmPassword) {
    throw new ValidationError('Hasło nie jest zgodne.');
  }
  const user = await UserRecord.getOneById(id);

  if (!user) {
    throw new ValidationError('Użytkownik nie istnieje!');
  }
  const newPassword = hashPassword(password);

  try {
    await UserRecord.updatePassword(id, newPassword);
    const attachment = emailAttachment();
    const html = emailCorrectChangePassword(user.email);
    sendEmail(user.email, 'MegaK - HeadHunter#6', html, attachment);
  } catch (err) {
    throw new ValidationError('Nie można zmienić hasła!');
  }
  res.json('Hasło zostało zmienione pomyślnie!',
  );
});
