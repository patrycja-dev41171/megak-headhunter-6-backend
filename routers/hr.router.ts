import { Router } from 'express';
import { HrRecord } from '../records/hr.record';
import { ValidationError } from '../utils/handleErrors';
import { StudentRecord } from '../records/student.record';
import { Status } from '../types';

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
      throw new ValidationError('Brak aktywnych kursantów w bazie!');
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
  })

  .get('/selected/students', async (req, res) => {
    const { hr_id } = req.body;

    const students = await StudentRecord.getSelectedStudents(hr_id);
    if (students === null) {
      throw new ValidationError('Nie masz zarezerwowanych kursantów.');
    }

    const hr = await HrRecord.getOneByUserId(hr_id);
    if (hr === null) {
      throw new ValidationError('Problem z twoim identyfikatorem. Skontaktuj się z administracją.');
    }

    for (const student of students) {
      const today = new Date();
      if (student.reservedTo < today) {
        try {
          let newArr: string[] = JSON.parse(hr.users_id_list);
          const include = newArr.includes(student.user_id);
          if (include) {
            newArr = newArr.filter(e => e !== `${student.user_id}`);
            await HrRecord.updateUsersIdList(hr_id, newArr);
          }
          await StudentRecord.updateStatusById(student.user_id, Status.Available, null, null);
        } catch (err) {
          throw new ValidationError('Wystąpił błąd podczas zmiany statusu kursanta w bazie danych.');
        }
      }
    }

    try {
      const studentsFE = await StudentRecord.getSelectedStudents(hr_id);
      res.json(studentsFE);
    } catch (err) {
      throw new ValidationError('Problem z pobraniem listy zarezerwowanych kursantów.');
    }
  });
