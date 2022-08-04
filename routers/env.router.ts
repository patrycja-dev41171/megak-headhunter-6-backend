import { Router } from 'express';
import { ValidationError } from '../utils/handleErrors';

export const envRouter = Router().get('/cloud-connection', async (req, res) => {
  try {
    res.json({
      upload_preset: process.env.UPLOAD_PRESET,
      api_call: process.env.API_CALL,
    });
  } catch (err) {
    throw new ValidationError('Problem z pobraniem danych. Spróbuj ponownie.');
  }
});
