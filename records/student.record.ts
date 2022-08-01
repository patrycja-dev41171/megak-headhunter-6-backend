import { ExpectedContractType, ExpectedTypeWork, Status, StudentEntity, StudentEntityImport } from '../types';
import { ValidationError } from '../utils/handleErrors';
import { v4 as uuid } from 'uuid';
import { FieldPacket } from 'mysql2';
import { pool } from '../utils/db';

type StudentRecordResult = [StudentEntityImport[], FieldPacket[]];

export class StudentRecord implements StudentEntity {
  id: string;
  user_id: string;
  email: string;
  courseCompletion?: number;
  courseEngagement?: number;
  projectDegree?: number;
  teamProjectDegree?: number;
  bonusProjectUrls?: string;
  tel?: number;
  firstName?: string;
  lastName?: string;
  githubUserName?: string;
  portfolioUrls?: string;
  projectUrls?: string;
  bio?: string;
  expectedTypeWork?: ExpectedTypeWork;
  targetWorkCity?: string;
  expectedContractType?: ExpectedContractType;
  expectedSalary?: number;
  canTakeApprenticeship?: number;
  monthsOfCommercialExp?: number;
  education?: string;
  workExperience?: string;
  courses?: string;
  status?: Status;
  hr_id?: string;

  constructor(obj: StudentEntity) {
    if (!obj.email || obj.email.length > 255) {
      throw new ValidationError('Email cannot be empty and cannot exceed 255 characters.');
    }
    if (typeof obj.email !== 'string') {
      throw new ValidationError('The format of the entered data is incorrect.');
    }
    if (obj.courseCompletion > 5 || obj.courseCompletion < 0) {
      throw new ValidationError('Course completion grade cannot be empty and must be in the range og 0 to 5');
    }
    if (typeof obj.courseCompletion !== 'number') {
      throw new ValidationError('The format of the entered data is incorrect.');
    }
    if (obj.courseEngagement > 5 || obj.courseEngagement < 0) {
      throw new ValidationError('Course engagement grade cannot be empty and must be in the range og 0 to 5');
    }
    if (typeof obj.courseEngagement !== 'number') {
      throw new ValidationError('The format of the entered data is incorrect.');
    }
    if (obj.projectDegree > 5 || obj.projectDegree < 0) {
      throw new ValidationError('Project degree cannot be empty and must be in the range og 0 to 5');
    }
    if (typeof obj.projectDegree !== 'number') {
      throw new ValidationError('The format of the entered data is incorrect.');
    }
    if (obj.teamProjectDegree > 5 || obj.teamProjectDegree < 0) {
      throw new ValidationError('Team project degree cannot be empty and must be in the range og 0 to 5');
    }
    if (typeof obj.teamProjectDegree !== 'number') {
      throw new ValidationError('The format of the entered data is incorrect.');
    }
    if (!obj.bonusProjectUrls) {
      throw new ValidationError('Bonus project urls array cannot be empty');
    }
    if (obj.firstName !== undefined && obj.firstName !== null && obj.firstName.length > 50) {
      throw new ValidationError('Firstname cannot be empty and cannot exceed 50 characters.');
    }
    if (obj.firstName !== undefined && obj.firstName !== null && typeof obj.firstName !== 'string') {
      throw new ValidationError('The format of the entered data is incorrect.');
    }
    if (obj.lastName !== undefined && obj.lastName !== null && obj.lastName.length > 50) {
      throw new ValidationError('Lastname  exceed 50 characters.');
    }
    if (obj.lastName !== undefined && obj.lastName !== null && typeof obj.lastName !== 'string') {
      throw new ValidationError('The format of the entered data is incorrect.');
    }
    if (obj.githubUserName !== undefined && obj.githubUserName !== null && obj.githubUserName.length > 100) {
      throw new ValidationError('Github user name  cannot exceed 100 characters.');
    }
    if (obj.githubUserName !== undefined && obj.githubUserName !== null && typeof obj.githubUserName !== 'string') {
      throw new ValidationError('The format of the entered data is incorrect.');
    }
    if (
      obj.expectedTypeWork !== undefined &&
      obj.expectedTypeWork !== null &&
      !Object.values(ExpectedTypeWork).includes(obj.expectedTypeWork)
    ) {
      throw new ValidationError('Expected type work has to be one of the enum ExpectedTypeWork options');
    }
    if (
      obj.expectedContractType !== undefined &&
      obj.expectedContractType !== null &&
      !Object.values(ExpectedContractType).includes(obj.expectedContractType)
    ) {
      throw new ValidationError('Expected contract type has to be one of the enum ExpectedContractType options');
    }
    if (obj.status !== undefined && obj.status !== null && !Object.values(Status).includes(obj.status)) {
      throw new ValidationError('Status has to be one of the enum Status options');
    }
    if (obj.monthsOfCommercialExp !== undefined && obj.monthsOfCommercialExp !== null && obj.monthsOfCommercialExp < 0) {
      throw new ValidationError('MonthsOfCommercialExperience  must be greater than 0.');
    }

    this.id = obj.id ?? null;
    this.email = obj.email ?? null;
    this.courseEngagement = obj.courseEngagement ?? null;
    this.projectDegree = obj.projectDegree ?? null;
    this.courseCompletion = obj.courseCompletion ?? null;
    this.teamProjectDegree = obj.teamProjectDegree ?? null;
    this.bonusProjectUrls = obj.bonusProjectUrls ?? null;
    this.tel = obj.tel ?? null;
    this.firstName = obj.firstName ?? null;
    this.lastName = obj.lastName ?? null;
    this.githubUserName = obj.githubUserName ?? null;
    this.portfolioUrls = obj.portfolioUrls ?? null;
    this.projectUrls = obj.projectUrls ?? null;
    this.bio = obj.bio ?? null;
    this.expectedTypeWork = obj.expectedTypeWork ?? null;
    this.targetWorkCity = obj.targetWorkCity ?? null;
    this.expectedContractType = obj.expectedContractType ?? null;
    this.expectedSalary = obj.expectedSalary ?? null;
    this.canTakeApprenticeship = obj.canTakeApprenticeship ?? null;
    this.monthsOfCommercialExp = obj.monthsOfCommercialExp ?? null;
    this.education = obj.education ?? null;
    this.workExperience = obj.workExperience ?? null;
    this.courses = obj.courses ?? null;
    this.status = obj.status ?? null;
    this.user_id = obj.user_id ?? null;
    this.hr_id = obj.hr_id ?? null;
  }

  async insert(): Promise<void> {
    if (!this.id) {
      this.id = uuid();
    } else {
      throw new ValidationError('Cannot insert somebody that already exists');
    }
    const [results] = (await pool.execute(
      'INSERT INTO `student` (`id`, `email`,`courseCompletion`, `courseEngagement`, `projectDegree`, `teamProjectDegree`, `bonusProjectUrls`,`user_id`) VALUES (:id,:email, :courseCompletion, :courseEngagement, :projectDegree, :teamProjectDegree, :bonusProjectUrls, :user_id)',
      {
        id: this.id,
        email: this.email,
        courseCompletion: this.courseCompletion,
        courseEngagement: this.courseEngagement,
        projectDegree: this.projectDegree,
        teamProjectDegree: this.projectDegree,
        bonusProjectUrls: this.bonusProjectUrls,
        user_id: this.user_id,
      }
    )) as StudentRecordResult;
  }

  async update(): Promise<void> {
    await pool.execute(
      'UPDATE `student` SET `tel` = :tel, `lastName` = :lastName, `firstName` = :firstName, `githubUserName` = :githubUserName, `portfolioUrls` = :portfolioUrls, `projectUrls` = :projectUrls, `bio` = :bio, `expectedTypeWork` = :expectedTypeWork, `targetWorkCity` = :targetWorkCity, `expectedContractType` = :expectedContractType, `expectedSalary` = :expectedSalary, `canTakeApprenticeship` = :canTakeApprenticeship, `monthsOfCommercialExp` = :monthsOfCommercialExp, `education` = :education, `workExperience` = :workExperience, `courses` = :courses ,`status` = :status  WHERE `email` = :email',
      {
        id: this.id,
        tel: this.tel,
        firstName: this.firstName,
        lastName: this.lastName,
        githubUserName: this.githubUserName,
        portfolioUrls: this.portfolioUrls,
        projectUrls: this.projectUrls,
        expectedTypeWork: this.expectedTypeWork,
        bio: this.bio,
        targetWorkCity: this.targetWorkCity,
        expectedContractType: this.expectedContractType,
        expectedSalary: this.expectedSalary,
        canTakeApprenticeship: this.canTakeApprenticeship,
        monthsOfCommercialExp: this.monthsOfCommercialExp,
        education: this.education,
        workExperience: this.workExperience,
        courses: this.courses,
        status: this.status,
        email: this.email,
      }
    );
  }

  static async getOneByEmail(email: string): Promise<StudentEntity> {
    const [results] = (await pool.execute('SELECT * FROM `student` WHERE `email` = :email', {
      email,
    })) as StudentRecordResult;
    return results.length === 0 ? null : new StudentRecord(results[0]);
  }
}
