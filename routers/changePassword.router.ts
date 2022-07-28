import { Router } from 'express';
import { ValidationError } from '../utils/handleErrors';
import { UserRecord } from '../records/user.record';
import { hashPassword } from '../utils/bcrypt-functions';
import { emailAttachment } from '../utils/emails/email-attachment';
import { sendEmail } from '../utils/sendEmail';

export const changePasswordRouter = Router().post('/:id', async (req, res) => {
  const { password, confirmPassword } = req.body;
  const { id } = req.params;

  if (password !== confirmPassword) {
    throw new ValidationError('Passwords do not match.');
  }
  const user = await UserRecord.getOneById(id);

  if (!user) {
    throw new ValidationError('User does not exist.');
  }
  const newPassword = hashPassword(password);

  try {
    await UserRecord.updatePassword(id, newPassword);
    const attachment = emailAttachment();
    const html = emailCorrectChangePassword(user.email);
    sendEmail(user.email, 'MegaK - HeadHunter#6', html, attachment);
  } catch (err) {
    throw new ValidationError('Cannot change password');
  }

  res.json({
    message: 'Password has been changed.',
  });
});
