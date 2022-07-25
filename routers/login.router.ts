import { Router } from 'express';
import { UserRecord } from '../records/user.record';
import { ValidationError } from '../utils/handleErrors';
import { LoginRecord } from '../records/login.record';
import { isPasswordCorrect } from '../utils/bcrypt-functions';

export const loginRouter = Router()
  .post('/', async (req, res) => {
    const { email, password } = req.body;
    const user = await UserRecord.getOneByEmail(email);
    if (!user) {
      throw new ValidationError('There is no user with this e-mail.');
    }
    if (user.registerToken !== null) {
      throw new ValidationError('User in the database but has not been registered.');
    }
    if (req.cookies.refreshToken !== undefined && (await LoginRecord.getOneByToken(req.cookies.refreshToken))) {
      throw new ValidationError('User is already logged in.');
    }

    const isCorrect = isPasswordCorrect(password, user.password);
    if (!isCorrect) {
      throw new ValidationError('Password incorrect.');
    }

    try {
      const response = await LoginRecord.createTokens(user.id);
      const loginRecord = new LoginRecord({
        user_id: user.id,
        refreshToken: response.refreshToken,
      });
      await loginRecord.insert();
      res
        .cookie('refreshToken', response.refreshToken, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
        })
        .json({
          id: user.id,
          accessToken: response.token,
          role: user.role,
        });
    } catch (err) {
      throw new ValidationError('An error occurred while trying to login the user.');
    }
  })

  .delete('/', async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new ValidationError('User cannot be logged off.');
    }
    try {
      await LoginRecord.getOneByToken(refreshToken);
      await LoginRecord.deleteOneByToken(refreshToken);
      res.clearCookie(refreshToken).json({
        message: 'User has been logged out.',
      });
    } catch (err) {
      throw new ValidationError('An error occurred while the user was signing out of the application.');
    }
  });
