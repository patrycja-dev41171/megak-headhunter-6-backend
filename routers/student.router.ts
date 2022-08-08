import { Router } from 'express';
import { StudentRecord } from '../records/student.record';
import { ValidationError } from '../utils/handleErrors';
import { Status } from '../types';
import { HrRecord } from '../records/hr.record';

export const studentRouter = Router();

studentRouter.post('/status', async (req, res) => {
  const { id, status, hr_id } = req.body;
  if (!id && !status) {
    throw new ValidationError('Nieprawidłowe dane z FE.');
  }

  if (!Object.values(Status).includes(status)) {
    throw new ValidationError('Nieprawidłowa nazwa statusu.');
  }

  const userStudent = await StudentRecord.getOneById(id);

  if (userStudent === null) {
    throw new ValidationError(`Brak w bazie kursanta o id: ${id}.`);
  }

  const userHr = await HrRecord.getOneByUserId(hr_id);
  if (userHr === null) {
    throw new ValidationError(`Brak w bazie hr o id: ${hr_id}. Skontaktuj się z administracja.`);
  }

  if (status === Status.Reserved) {
    try {
      const today = new Date();
      const reservedTo = new Date();
      reservedTo.setDate(today.getDate() + 10);
      await StudentRecord.updateStatusById(id, status, reservedTo, hr_id);
      const newArr: string[] = JSON.parse(userHr.users_id_list);

      const include = newArr.includes(id);
      if (include) {
        throw new ValidationError('Zarezerwowałeś już tego kursanta.');
      }

      newArr.push(id);
      await HrRecord.updateUsersIdList(hr_id, newArr);
      res.json(`Zmieniono status kursanta na: ${status}.`);
    } catch (err) {
      throw new ValidationError('Wystąpił błąd podczas zmiany statusu studenta w bazie danych.');
    }
  }

  if (status !== Status.Reserved) {
    try {
      let newArr: string[] = JSON.parse(userHr.users_id_list);
      const include = newArr.includes(id);
      if (include) {
        newArr = newArr.filter(e => e !== `${id}`);
        await HrRecord.updateUsersIdList(hr_id, newArr);
      }
      const reservedTo: Date = null;
      await StudentRecord.updateStatusById(id, status, reservedTo, null);
      res.json(`Zmieniono status kursanta na: ${status}.`);
    } catch (err) {
      throw new ValidationError('Wystąpił błąd podczas zmiany statusu studenta w bazie danych.');
    }
  }
});
