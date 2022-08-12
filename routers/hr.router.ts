import { Router } from 'express';
import { HrRecord } from '../records/hr.record';
import { ValidationError } from '../utils/handleErrors';
import { StudentRecord } from '../records/student.record';
import { getAllFilter, HrFrontEntity } from '../types';
import { pool } from '../utils/db';
import { FieldPacket } from 'mysql2';
import { HrStudentRecord } from '../records/hr_student.record';

type typesData = [getAllFilter[], FieldPacket[]];

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
  .post('/home/filterList', async (req, res) => {
    let querySql =
      'SELECT `student`.`user_id`,`student`.`firstName`,`student`.`lastName`,`student`.`courseCompletion`,`student`.`courseEngagement`,`student`.`projectDegree`,`student`.`teamProjectDegree`,`student`.`expectedTypeWork`,`student`.`targetWorkCity`,`student`.`expectedContractType`,`student`.`expectedSalary`,`student`.`canTakeApprenticeship`,`student`.`monthsOfCommercialExp` FROM `student` WHERE (`status` = "Dostępny")';
    const {
      courseCompletion,
      courseEngagement,
      projectDegree,
      teamProjectDegree,
      expectedTypeWork,
      expectedContractType,
      minSalary,
      maxSalary,
      canTakeApprenticeship,
      monthsOfCommercialExp,
    } = req.body;

    if (courseCompletion) {
      querySql += ' AND `courseCompletion` >= ' + Number(courseCompletion);
    }

    if (courseEngagement) {
      querySql += ' AND `courseEngagement` >= ' + Number(courseEngagement);
    }

    if (projectDegree) {
      querySql += ' AND `projectDegree` >= ' + Number(projectDegree);
    }

    if (teamProjectDegree) {
      querySql += ' AND `teamProjectDegree` >= ' + Number(teamProjectDegree);
    }

    if (expectedTypeWork) {
      querySql += '  AND (';

      for (const typeWork of expectedTypeWork) {
        querySql += ' `expectedTypeWork` = ' + `"${typeWork}"  OR`;
      }

      querySql = querySql.slice(0, -2);
      querySql += ')';
    }
    //
    if (expectedContractType) {
      querySql += '  AND (';

      for (const typeContract of expectedContractType) {
        querySql += ' `expectedContractType` = ' + `"${typeContract}"  OR`;
      }

      querySql = querySql.slice(0, -2);
      querySql += ')';
    }
    if (minSalary && minSalary !== 0) {
      querySql += ' AND `expectedSalary` >= ' + Number(minSalary);
    }

    if (maxSalary) {
      querySql += ' AND `expectedSalary` <= ' + Number(maxSalary);
    }

    if (canTakeApprenticeship) {
      querySql += ' AND `canTakeApprenticeship` = ' + Number(canTakeApprenticeship);
    }

    if (monthsOfCommercialExp) {
      querySql += ' AND `monthsOfCommercialExp` >= ' + Number(monthsOfCommercialExp);
    }

    const [result] = (await pool.execute(querySql)) as typesData;
    const data = result.length === 0 ? null : result;

    if (!data) {
      throw new ValidationError('Nie znaleziono według kryteriów wyszukiwania!');
    }

    res.status(200).json(data);
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
      throw new ValidationError(`Użytkownik o takim id: ${id} nie występuje w systemie.`);
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

    const reservedStudents = await HrStudentRecord.getAllByHrId(hr_id);
    if (reservedStudents === null) {
      res.json(reservedStudents);
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
