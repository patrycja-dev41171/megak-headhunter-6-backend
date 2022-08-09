import { Router } from 'express';
import { HrRecord } from '../records/hr.record';
import { ValidationError } from '../utils/handleErrors';
import { StudentRecord } from '../records/student.record';

export const hrRouter = Router();

hrRouter
  .get('/:userId', async (req, res) => {
    const hrFind = await HrRecord.getOneByUserId(req.params.userId);
    if (!hrFind) {
      throw new ValidationError('Nie zlokalizowano danego HR w bazie danych!');
    }
    res.status(200).json(hrFind);
  })
  .get('/home/getAll', async (req, res) => {
    const allStudentsByStatusAvailable = await StudentRecord.getAllByStatus();
    if (!allStudentsByStatusAvailable) {
      throw new ValidationError('Brak aktywnych studentów w bazie!');
    }
    res.status(200).json(allStudentsByStatusAvailable);
  })

  .post('/set/photo', async (req, res) => {
    const { id, img_src } = req.body;
    if (!id || !img_src) {
      throw new ValidationError('Brak odpowiednich danych.');
    }

    const user = await HrRecord.getOneByUserId(id);
    if (user === null) {
      throw new ValidationError('Użytkownik o takim id nie występuje w systemie.');
    }

    try {
      await HrRecord.addImgById(id, img_src);
      res.json('Zdjęcie poprawnie zapisane.');
    } catch (err) {
      throw new ValidationError('Błąd zapisywania zdjęcia w bazie danych.');
    }
  });
