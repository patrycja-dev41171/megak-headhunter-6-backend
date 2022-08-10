import { Router } from 'express';
import { HrRecord } from '../records/hr.record';
import { ValidationError } from '../utils/handleErrors';
import { StudentRecord } from '../records/student.record';
import { getAllFilter, Status, studentMapFilterTypeWork } from '../types';
import { pool } from '../utils/db';
import { FieldPacket } from 'mysql2';

type typesData = [getAllFilter[], FieldPacket[]];

export const hrRouter = Router();

hrRouter
  .get('/:userId', async (req, res) => {
    const hrFind = await HrRecord.getOneByUserId(req.params.userId);
    if (!hrFind) {
      throw new ValidationError('Nie zlokalizowano danego HR w bazie danych!');
    }
    res.status(200).json(hrFind);
  })
  .post('/home/filterList', async (req, res) => {
    let querySql =
      'SELECT `student`.`user_id`,`student`.`firstName`,`student`.`lastName`,`student`.`courseCompletion`,`student`.`courseEngagement`,`student`.`projectDegree`,`student`.`teamProjectDegree`,`student`.`expectedTypeWork`,`student`.`targetWorkCity`,`student`.`expectedContractType`,`student`.`expectedSalary`,`student`.`canTakeApprenticeship`,`student`.`monthsOfCommercialExp` FROM `student` WHERE (`status` = "Dostępny" OR `status` = "W trakcie rozmowy")';
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

    const typesWork = expectedTypeWork ? expectedTypeWork.map((el: studentMapFilterTypeWork) => el.value) : null;
    const typesContract = expectedContractType ? expectedContractType.map((el: studentMapFilterTypeWork) => el.value) : null;

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

      for (const typeWork of typesWork) {
        querySql += ' `expectedTypeWork` = ' + `"${typeWork}"  OR`;
      }

      querySql = querySql.slice(0, -2);
      querySql += ')';
    }
    //
    if (expectedContractType) {
      querySql += '  AND (';

      for (const typeContract of typesContract) {
        querySql += ' `expectedContractType` = ' + `"${typeContract}"  OR`;
      }

      querySql = querySql.slice(0, -2);
      querySql += ')';
    }
    //
    if (minSalary) {
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

    console.log(querySql);
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
