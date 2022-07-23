import { Router } from 'express';
import { ValidationError } from '../utils/handleErrors';

export const uploadRouter = Router();

uploadRouter.post('/upload', async (req, res) => {
  if (!req.files) {
    throw new ValidationError('Nie przesłano pliku !');
  }

  try {
    const [data] = Object.entries(req.files);
    const primaryData: any = data[1];

    const finallyData = [...JSON.parse(primaryData.data)];

    console.log(finallyData);
    res.send('ok');
  } catch (err) {
    throw new ValidationError('Błąd spróbuj ponownie później');
  }
});
