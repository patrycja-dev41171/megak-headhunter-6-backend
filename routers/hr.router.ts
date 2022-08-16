import { Router } from 'express';
import { HrRecord } from '../records/hr.record';
import { ValidationError } from '../utils/handleErrors';
import { StudentRecord } from '../records/student.record';
import { FilterReqBody, FilterReqBodyDataId, getAllFilter, HrFrontEntity, HrStudentIdEntity, StudentGetAll } from '../types';
import { HrStudentRecord } from '../records/hr_student.record';
import { FilterByHrId } from '../utils/filter/decoratorFilterUserId';
import { Filter } from '../utils/filter/decoratorFilter';
import { GetAll } from '../utils/filter/decoratorGetAll';

export const hrRouter = Router();

hrRouter
  .get('/:userId', async (req, res) => {
    const hr_id = req.params.userId;
    const hrFind = await HrRecord.getOneByUserId(hr_id);
    if (!hrFind) {
      throw new ValidationError('Nie zlokalizowano danego HR w bazie danych!');
    }

    const reservedStudents = await HrStudentRecord.getAllByHrId(hr_id);
    let reservedStudentNum: number;
    if (reservedStudents === null) {
      reservedStudentNum = 0;
    } else reservedStudentNum = reservedStudents.length;

    const hr = {
      ...hrFind,
      reservedStudents: reservedStudentNum,
    } as HrFrontEntity;

    res.status(200).json(hr);
  })

  .post('/home/filterList/:hrID', async (req, res) => {
    res.status(200).json(await Filter(req.body as FilterReqBody, req.params.hrID));
  })

  .post('/home/selectedStudents/filterList', async (req, res) => {
    res.status(200).json(await FilterByHrId(req.body as FilterReqBodyDataId));
  })

  .get('/home/getAll/:hrId', async (req, res) => {
    res.status(200).json(await GetAll(req.params.hrId));
  })

  .post('/set/photo', async (req, res) => {
    const { id, img_src } = req.body;
    if (!id || !img_src) {
      throw new ValidationError('Brak odpowiednich danych.');
    }

    const user = await HrRecord.getOneByUserId(id);
    if (user === null) {
      throw new ValidationError(`Użytkownik o takim id: ${id} nie występuje w systemie.`);
    }

    try {
      await HrRecord.addImgById(id, img_src);
      res.json('Zdjęcie poprawnie zapisane.');
    } catch (err) {
      throw new ValidationError('Błąd zapisywania zdjęcia w bazie danych.');
    }
  })

  .get('/selected/students/:hr_id', async (req, res) => {
    const { hr_id } = req.params;

    const reservedStudents = await HrStudentRecord.getAllByHrId(hr_id);
    if (reservedStudents === null) {
      throw new ValidationError('Brak zarezerwowanych studentów.');
    }

    const hr = await HrRecord.getOneByUserId(hr_id);
    if (hr === null) {
      throw new ValidationError('Problem z twoim identyfikatorem. Skontaktuj się z administracją.');
    }

    for (const reservedStudent of reservedStudents) {
      const today = new Date();
      if (reservedStudent.reservedTo < today) {
        try {
          await HrStudentRecord.deleteOneById(reservedStudent.id);
        } catch (err) {
          throw new ValidationError(`Problem z automatycznym usunięciem użytkownika z listy zarezerwowanych przez Hr o id: ${hr_id}`);
        }
      }
    }

    try {
      const reservedStudents = await HrStudentRecord.getAllByHrId(hr_id);
      if (reservedStudents === null) {
        res.json(reservedStudents);
      } else {
        let selectedStudents = [];

        for (const reservedStudent of reservedStudents) {
          const student = await StudentRecord.getOneById(reservedStudent.student_id);
          const reservedTo = reservedStudent.reservedTo;
          const SelectedStudent = {
            ...student,
            reservedTo,
          };
          selectedStudents.push(SelectedStudent);
        }

        res.json(selectedStudents);
      }
    } catch (err) {
      throw new ValidationError('Problem z pobraniem listy zarezerwowanych kursantów.');
    }
  });
