import { Router } from 'express';
import { ValidationError } from '../utils/handleErrors';

export const uploadRouter = Router();

uploadRouter.post('/', async (req, res) => {
  if (!req.files) {
    throw new ValidationError('Nie przesłano pliku !');
  }

  const [data] = Object.entries(req.files);
  const primaryData: any = data[1];

  if (primaryData.mimetype !== 'application/json') {
    throw new ValidationError('Plik musi być w formacie JSON !');
  }

  const parseData = JSON.parse(primaryData.data);
  const emailValidate = new RegExp('@');

  const validateData = parseData.map((el: any) => {
    if (!emailValidate.test(el.email)) {
      throw new ValidationError('Dane z pliku są nieprawidłowe, email musi zawierać @');
    } else {
      return el;
    }
  });

  // Do zrobienia: dodawanie do bazy danych oraz walidacja uzytkownikow podczas dodawania.

  res.status(200).json('the files has been uploading Success');
});
