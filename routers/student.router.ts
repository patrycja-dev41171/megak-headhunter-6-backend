import { Router } from 'express';
import { StudentRecord } from '../records/student.record';
import { ValidationError } from '../utils/handleErrors';
import { Status } from '../types';
import { HrRecord } from '../records/hr.record';
import { HrStudentRecord } from '../records/hr_student.record';
import { user } from 'firebase-functions/lib/providers/auth';

export const studentRouter = Router();

studentRouter.post('/hired', async (req, res) => {
  const { user_id } = req.body;
  if (!user_id) {
    throw new ValidationError('Brak wymaganych danych.');
  }
  try {
    await StudentRecord.updateStatus(user_id);
    await HrStudentRecord.deleteManyByStudentId(user_id);
    res.json('Zmieniono status kursanta.');
  } catch (err) {
    throw new ValidationError(`Wystąpił błąd podczas zminay statusu na ${Status.Hired}. Spróbuj ponownie.`);
  }
});

studentRouter
  .post('/reserved', async (req, res) => {
    const { student_id, hr_id } = req.body;
    if (!student_id && !hr_id) {
      throw new ValidationError('Brak wymaganych danych.');
    }
    const hr = await HrRecord.getOneByUserId(hr_id);
    if (hr === null) {
      throw new ValidationError('Nie możesz dokonać rezerwacji, nieprawidłowe dane. Skontaktuj się z administracją.');
    }

    const student = await StudentRecord.getOneById(student_id);
    if (student === null) {
      throw new ValidationError('Nie możesz dokonać rezerwacji, nieprawidłowe dane. Skontaktuj się z administracją.');
    }

    const result = await HrStudentRecord.getOneByHrIdAndStudentId(hr_id, student_id);

    if (result !== null) {
      throw new ValidationError('Zarezerwowałeś już tego uzytkownika!');
    }

    const reservedStudents = await HrStudentRecord.getAllByHrId(hr_id);
    if (reservedStudents !== null) {
      if (hr.maxReservedStudents <= reservedStudents.length) {
        throw new ValidationError('Nie możesz zarezerwować więcej użytkowników!');
      }
    }

    const today = new Date();
    const reservedTo = new Date();
    reservedTo.setDate(today.getDate() + 10);

    try {
      const reservation = new HrStudentRecord({
        hr_id,
        student_id,
        reservedTo: reservedTo,
      });

      await reservation.insertOne();

      res.json('Zarezerwowano kursanta.');
    } catch (err) {
      throw new ValidationError(`Wystąpił błąd podczas zminay statusu na ${Status.Hired}. Spróbuj ponownie.`);
    }
  })

  .post('/cancel/reservation', async (req, res) => {
      const {student_id, hr_id} = req.body;

      const reservation = await HrStudentRecord.getOneByHrIdAndStudentId(hr_id, student_id);
      if(reservation === null) {
          throw new ValidationError("Bład. Brak takiej rezerwacji w bazie danych.")
      }

      try {
          await HrStudentRecord.deleteOneById(reservation.id)
          res.json("Zrezygnowałeś z danego kursanta.")
      } catch (err){
       throw new ValidationError("Wystąpił błąd podczas rezygnacji z kursanta.")
      }
  });
