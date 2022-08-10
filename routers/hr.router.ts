import { Router } from 'express';
import { HrRecord } from '../records/hr.record';
import { ValidationError } from '../utils/handleErrors';
import { StudentRecord } from '../records/student.record';
import { pool } from '../utils/db';
import { StudentGetAll, studentMapFilterTypeWork } from '../types';
import { FieldPacket } from 'mysql2';

type getAllFilter = [StudentGetAll[], FieldPacket[]];

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

    const [result] = (await pool.execute(querySql)) as getAllFilter;
    const data = result.length === 0 ? null : result;

    if (!data) {
      throw new ValidationError('Nie znaleziono wedlug kryteriów wyszukiwania!');
    }

    res.status(200).json(data);
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
