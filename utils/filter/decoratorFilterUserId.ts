import { pool } from '../db';
import { ValidationError } from '../handleErrors';
import { FilterReqBodyDataId, getAllFilter } from '../../types';
import { FieldPacket } from 'mysql2';

export async function FilterByHrId(enterData: FilterReqBodyDataId) {
  type typesData = [getAllFilter[], FieldPacket[]];
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
    hr_id,
  } = enterData;

  let querySql =
    'SELECT `student`.`user_id`,`student`.`firstName`,`student`.`lastName`,`student`.`courseCompletion`,`student`.`courseEngagement`,`student`.`projectDegree`,`student`.`teamProjectDegree`,`student`.`expectedTypeWork`,`student`.`targetWorkCity`,`student`.`expectedContractType`,`student`.`expectedSalary`,`student`.`canTakeApprenticeship`,`student`.`monthsOfCommercialExp`, `hr_student`.`reservedTo` FROM `hr_student` INNER JOIN `student` on `hr_student`.`student_id` = `student`.`user_id` WHERE `hr_student`.`hr_id` =  ';

  if (hr_id) {
    querySql += `"${hr_id}"`;
  }

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

  if (expectedTypeWork && expectedTypeWork.length !== 0) {
    querySql += '  AND (';

    for (const typeWork of expectedTypeWork) {
      querySql += ' `expectedTypeWork` = ' + `"${typeWork}"  OR`;
    }

    querySql = querySql.slice(0, -2);
    querySql += ')';
  }
  if (expectedContractType && expectedContractType.length !== 0) {
    querySql += '  AND (';

    for (const typeContract of expectedContractType) {
      querySql += ' `expectedContractType` = ' + `"${typeContract}"  OR`;
    }

    querySql = querySql.slice(0, -2);
    querySql += ')';
  }
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

  const [result] = (await pool.execute(querySql)) as typesData;
  const data = result.length === 0 ? null : result;

  if (!data) {
    throw new ValidationError('Nie znaleziono według kryteriów wyszukiwania!');
  }

  return data;
}
