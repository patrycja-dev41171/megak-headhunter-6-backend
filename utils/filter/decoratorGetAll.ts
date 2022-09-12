import {HrStudentIdEntity, StudentGetAll} from "../../types";
import {FieldPacket} from "mysql2";
import {HrStudentRecord} from "../../records/hr_student.record";
import {pool} from "../db";
import {ValidationError} from "../handleErrors";


export const GetAll = async(hrID:string) => {
    type StudentGetList = [StudentGetAll[], FieldPacket[]];
    if(!hrID){
        throw new ValidationError("Nie można znaleść listy dla twojego konta !");
    }
    const hrStudents = await HrStudentRecord.getAll(hrID);
    let querySql:string = 'SELECT `student`.`user_id`,`student`.`firstName`,`student`.`lastName`,`student`.`courseCompletion`,`student`.`courseEngagement`,`student`.`projectDegree`,`student`.`teamProjectDegree`,`student`.`expectedTypeWork`,`student`.`targetWorkCity`,`student`.`expectedContractType`,`student`.`expectedSalary`,`student`.`canTakeApprenticeship`,`student`.`monthsOfCommercialExp` FROM `student` WHERE `status` ="Dostępny" ';
    if (hrStudents) {
        const filterMap = hrStudents.map((el:HrStudentIdEntity)=> el.student_id);
        querySql += '  AND (';
        for (const singleId of filterMap) {
            querySql += ' `student`.`user_id` != ' + `"${singleId}"  AND`;
        }
        querySql = querySql.slice(0, -3);
        querySql += ')';
    }
    const [results] = await pool.execute(querySql) as StudentGetList;
    const data = results.length === 0 ? null : results;

    return data;

}



