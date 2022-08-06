import { Router } from 'express';
import { StudentRecord } from '../records/student.record';
import { ValidationError } from '../utils/handleErrors';
import { Status } from '../types';

export const studentRouter = Router();

studentRouter.post('/status', async (req, res) => {
  const { id, status, hr_id } = req.body;

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

  if (status === Status.Reserved) {
    try {
      const today = new Date();
      const reservedTo = new Date();
      reservedTo.setDate(today.getDate() + 10);
      await StudentRecord.updateStatusById(id, status, reservedTo, hr_id);
      res.json(`Zmieniono status kursanta na: ${status}.`);
    } catch (err) {
      throw new ValidationError('Wystąpił błąd podczas zmiany statusu studenta w bazie danych.');
    }
  } else {
    try {
      const reservedTo: Date = null;
      const hr_id: string = null;
      await StudentRecord.updateStatusById(id, status, reservedTo, hr_id);
      res.json(`Zmieniono status kursanta na: ${status}.`);
    } catch (err) {
      throw new ValidationError('Wystąpił błąd podczas zmiany statusu studenta w bazie danych.');
    }
  }
});
