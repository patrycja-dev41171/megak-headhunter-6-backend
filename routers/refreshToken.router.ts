import { Router } from 'express';
import { LoginRecord } from '../records/login.record';
import jwt from 'jsonwebtoken';
import { ValidationError } from '../utils/handleErrors';
import { UserRecord } from '../records/user.record';

export const refreshTokenRouter = Router().get('/', async (req, res) => {
  const refreshToken: string = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new ValidationError('Invalid refreshToken.');
  }

  const result = await LoginRecord.getOneByToken(refreshToken);
  if (!result) {
    res.clearCookie('refreshToken');
    throw new ValidationError('No login details in the database.');
  }

  const user = await UserRecord.getOneById(result.user_id);

  jwt.verify(refreshToken, process.env.ACCESS_REFRESH_TOKEN_KEY, err => {
    if (err) {
      res.clearCookie('refreshToken');
      throw new ValidationError('Invalid refreshToken verification.');
    }

    try {
      const accessToken = jwt.sign({ id: result.user_id }, process.env.ACCESS_TOKEN_KEY, { expiresIn: '10min' });
      res.json({
        accessToken: accessToken,
        id: user.id,
      });
    } catch (err) {
      throw new ValidationError('Error refreshing tokens.');
    }
  });
});
