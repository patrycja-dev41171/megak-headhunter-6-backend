import {FilterReqBody, getAllFilter, HrStudentIdEntity} from '../../types';
import { FieldPacket } from 'mysql2';
import { pool } from '../db';
import { ValidationError } from '../handleErrors';
import {HrStudentRecord} from "../../records/hr_student.record";
import {escape} from 'sqlstring';

export async function Filter(enterData: FilterReqBody, hrID :string) {
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
  } = enterData;

  if(!hrID){
    throw new ValidationError("Nie można znaleść listy dla twojego konta !");
  }
  let querySql =
    'SELECT `student`.`user_id`,`student`.`firstName`,`student`.`lastName`,`student`.`courseCompletion`,`student`.`courseEngagement`,`student`.`projectDegree`,`student`.`teamProjectDegree`,`student`.`expectedTypeWork`,`student`.`targetWorkCity`,`student`.`expectedContractType`,`student`.`expectedSalary`,`student`.`canTakeApprenticeship`,`student`.`monthsOfCommercialExp` FROM `student` WHERE `status` = "Dostępny" ';

  const hrStudents = await HrStudentRecord.getAll(hrID);

  if (hrStudents) {
    const filterMap = hrStudents.map((el:HrStudentIdEntity)=> el.student_id);
    querySql += '  AND (';
    for (const singleId of filterMap) {
      querySql += ' `student`.`user_id` != ' + `${escape(singleId)}  AND`;
    }
    querySql = querySql.slice(0, -3);
    querySql += ')';
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
      querySql += ' `expectedTypeWork` = ' + `${escape(typeWork)}  OR`;
    }

    querySql = querySql.slice(0, -2);
    querySql += ')';
  }
  if (expectedContractType && expectedContractType.length !== 0) {
    querySql += '  AND (';

    for (const typeContract of expectedContractType) {
      querySql += ' `expectedContractType` = ' + `${escape(typeContract)}  OR`;
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
