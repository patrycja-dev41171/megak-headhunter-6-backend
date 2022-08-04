import { Router } from 'express';
import { StudentRecord } from '../records/student.record';
import { ValidationError } from '../utils/handleErrors';
import { Status } from '../types';

export const studentRouter = Router();

studentRouter.post('/status', async (req, res) => {
  const { id, status } = req.body;

  if (!id && !status) {
    throw new ValidationError('Nieprawidłowe dane z FE.');
  }

  if (!Object.values(Status).includes(status)) {
    throw new ValidationError('Nieprawidłowa nazwa statusu.');
  }

  const user = StudentRecord.getOneById(id);
  if (user === null) {
    throw new ValidationError(`Brak w bazie kursanta o id: ${id}.`);
  }
  try {
    await StudentRecord.updateStatusById(id, status);
    res.json(`Zmieniono status kursanta na: ${status}.`);
  } catch (err) {
    throw new ValidationError('Wystąpił błąd podczas zmiany statusu studenta w bazie danych.');
  }
});
