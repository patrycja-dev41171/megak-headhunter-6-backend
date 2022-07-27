import { ExpectedContractType, ExpectedTypeWork, Status, StudentEntity, StudentEntityImport } from '../types';
import { ValidationError } from '../utils/handleErrors';
import { v4 as uuid } from 'uuid';
import { FieldPacket } from 'mysql2';
import { pool } from '../utils/db';

type StudentRecordResult = [StudentEntityImport[], FieldPacket[]];

export class StudentRecord implements StudentEntity {
  id?: string;
  user_id: string;
  email: string;
  courseCompletion: number;
  courseEngagement: number;
  projectDegree: number;
  teamProjectDegree: number;
  bonusProjectUrls: string;
  tel?: number;
  firstName?: string;
  lastName?: string;
  githubUserName?: string;
  portfolioUrls?: string[];
  projectUrls?: string[];
  bio?: string;
  expectedTypeWork?: ExpectedTypeWork;
  targetWorkCity?: string;
  expectedContractType?: ExpectedContractType;
  expectedSalary?: number;
  canTakeApprenticeship?: boolean;
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
    if (!obj.courseCompletion || obj.courseCompletion > 5 || obj.courseCompletion < 0) {
      throw new ValidationError('Course completion grade cannot be empty and must be in the range og 0 to 5');
    }
    if (typeof obj.courseCompletion !== 'number') {
      throw new ValidationError('The format of the entered data is incorrect.');
    }
    if (!obj.courseEngagement || obj.courseEngagement > 5 || obj.courseEngagement < 0) {
      throw new ValidationError('Course engagement grade cannot be empty and must be in the range og 0 to 5');
    }
    if (typeof obj.courseEngagement !== 'number') {
      throw new ValidationError('The format of the entered data is incorrect.');
    }
    if (!obj.projectDegree || obj.projectDegree > 5 || obj.projectDegree < 0) {
      throw new ValidationError('Project degree cannot be empty and must be in the range og 0 to 5');
    }
    if (typeof obj.projectDegree !== 'number') {
      throw new ValidationError('The format of the entered data is incorrect.');
    }
    if (!obj.teamProjectDegree || obj.teamProjectDegree > 5 || obj.teamProjectDegree < 0) {
      throw new ValidationError('Team project degree cannot be empty and must be in the range og 0 to 5');
    }
    if (typeof obj.teamProjectDegree !== 'number') {
      throw new ValidationError('The format of the entered data is incorrect.');
    }
    if (!obj.bonusProjectUrls) {
      throw new ValidationError('Bonus project urls array cannot be empty');
    }
    // if (!obj.firstName || obj.firstName.length > 50) {
    //   throw new ValidationError('Firstname cannot be empty and cannot exceed 50 characters.');
    // }
    // if (typeof obj.firstName !== 'string') {
    //   throw new ValidationError('The format of the entered data is incorrect.');
    // }
    // if (!obj.lastName || obj.lastName.length > 50) {
    //   throw new ValidationError('Lastname cannot be empty and cannot exceed 50 characters.');
    // }
    // if (typeof obj.lastName !== 'string') {
    //   throw new ValidationError('The format of the entered data is incorrect.');
    // }
    // if (!obj.githubUserName || obj.githubUserName.length > 100) {
    //   throw new ValidationError('Github user name cannot be empty and cannot exceed 100 characters.');
    // }
    // if (typeof obj.githubUserName !== 'string') {
    //   throw new ValidationError('The format of the entered data is incorrect.');
    // }
    //
    // if (!obj.projectUrls) {
    //   throw new ValidationError('Project urls cannot be empty.');
    // }
    // if (!Object.values(ExpectedTypeWork).includes(obj.expectedTypeWork)) {
    //   throw new ValidationError('Expected type work has to be one of the enum ExpectedTypeWork options');
    // }
    // if (!Object.values(ExpectedContractType).includes(obj.expectedContractType)) {
    //   throw new ValidationError('Expected contract type has to be one of the enum ExpectedContractType options');
    // }
    // if (!Object.values(Status).includes(obj.status)) {
    //   throw new ValidationError('Status has to be one of the enum Status options');
    // }
    // if (!obj.monthsOfCommercialExp || obj.monthsOfCommercialExp > 0) {
    //   throw new ValidationError('MonthsOfCommercialExperience cannot be empty and must be greater than 0.');
    // }

    this.id = obj.id;
    this.email = obj.email;
    this.courseEngagement = obj.courseEngagement;
    this.projectDegree = obj.projectDegree;
    this.courseCompletion = obj.courseCompletion;
    this.teamProjectDegree = obj.teamProjectDegree;
    this.bonusProjectUrls = obj.bonusProjectUrls;
    this.tel = obj.tel;
    this.firstName = obj.firstName;
    this.lastName = obj.lastName;
    this.githubUserName = obj.githubUserName;
    this.portfolioUrls = obj.portfolioUrls;
    this.projectUrls = obj.projectUrls;
    this.bio = obj.bio;
    this.expectedTypeWork = obj.expectedTypeWork;
    this.targetWorkCity = obj.targetWorkCity;
    this.expectedContractType = obj.expectedContractType;
    this.expectedSalary = obj.expectedSalary;
    this.canTakeApprenticeship = obj.canTakeApprenticeship;
    this.monthsOfCommercialExp = obj.monthsOfCommercialExp;
    this.education = obj.education ?? null;
    this.workExperience = obj.workExperience;
    this.courses = obj.courses;
    this.status = obj.status;
    this.user_id = obj.user_id;
    this.hr_id = obj.hr_id;
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
      'UPDATE `student` SET `tel` = :tel, `lastName` = :lastName, `firstName` = :firstName, `githubUserName` = :githubUserName, `portfolioUrls` = :portfolioUrls, `projectUrls` = :projectUrls, `bio` = :bio, `expectedTypeWork` = :expectedTypeWork, `targetWorkCity` = :targetWorkCity, `expectedContractType` = :expectedContractType, `expectedSalary` = :expectedSalary, `canTakeApprenticeship` = :canTakeApprenticeship, `monthsOfCommercialExp` = :monthsOfCommercialExp, `education` = :education, `workExperience` = :workExperience, `courses` = :courses, `status` = :status, `user_id` = :user_id, `hr_id` = :hr_id WHERE `id` = :id',
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
        user_id: this.user_id,
        hr_id: this.hr_id,
      }
    );
  }
}
