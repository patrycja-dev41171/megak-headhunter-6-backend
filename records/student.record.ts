import { ExpectedContractType, ExpectedTypeWork, Status, StudentEntity, StudentEntityImport } from '../types';
import { ValidationError } from '../utils/handleErrors';
import { v4 as uuid } from 'uuid';
import { FieldPacket } from 'mysql2';
import { pool } from '../utils/db';

type StudentRecordResult = [StudentEntityImport[], FieldPacket[]];

export class StudentRecord implements StudentEntity {
  id?: string;
  email?: string;
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
  user_id: string;
  hr_id?: string;
  reservedTo?: Date;

  constructor(obj: StudentEntity) {
    if (obj.email !== undefined && obj.email !== null && (!obj.email || obj.email.length > 255)) {
      throw new ValidationError('Pole Email nie może być puste oraz zawierać więcej niż 255 znaków!');
    }
    if (obj.email !== undefined && obj.email !== null && typeof obj.email !== 'string') {
      throw new ValidationError('Format danych pola: E-mail jest nieprawidłowy!');
    }
    if (!obj.courseCompletion || obj.courseCompletion > 5 || obj.courseCompletion < 0) {
      throw new ValidationError('Pole Ukończenie kursu nie może być puste oraz musi zawierać się w przedziale od 0 do 5!');
    }
    if (typeof obj.courseCompletion !== 'number') {
      throw new ValidationError('Format danych pola: Ukończenie kursu jest nieprawidłowy!');
    }
    if (!obj.courseEngagement || obj.courseEngagement > 5 || obj.courseEngagement < 0) {
      throw new ValidationError('Pole Zaangażowanie w kursie nie może być puste oraz  musi zawierać się w przedziale od 0 do 5!');
    }
    if (typeof obj.courseEngagement !== 'number') {
      throw new ValidationError('Format danych pola: Zaangażowanie w kursie jest nieprawidłowy !.');
    }
    if (!obj.projectDegree || obj.projectDegree > 5 || obj.projectDegree < 0) {
      throw new ValidationError('Pole Stopień projektowy nie może być puste oraz  musi zawierać się w przedziale od 0 do 5!');
    }
    if (typeof obj.projectDegree !== 'number') {
      throw new ValidationError('Format danych pola: Stopień projektowy  jest nieprawidłowy!');
    }
    if (!obj.teamProjectDegree || obj.teamProjectDegree > 5 || obj.teamProjectDegree < 0) {
      throw new ValidationError('Pole Zespołowy stopień projektowy nie może być puste oraz  musi zawierać się w przedziale od 0 do 5!');
    }
    if (typeof obj.teamProjectDegree !== 'number') {
      throw new ValidationError('Format danych pola: Zespołowy stopień projektowy  jest nieprawidłowy!');
    }
    if (!obj.bonusProjectUrls) {
      throw new ValidationError('Pole Projekt bonusowy nie może być puste!');
    }
    if (obj.firstName !== undefined && obj.firstName !== null && obj.firstName.length > 50) {
      throw new ValidationError('Pole Imię nie może przekracać 50 znaków!');
    }
    if (obj.firstName !== undefined && obj.firstName !== null && typeof obj.firstName !== 'string') {
      throw new ValidationError('Format danych pola: Imię  jest nieprawidłowy!');
    }
    if (obj.lastName !== undefined && obj.lastName !== null && obj.lastName.length > 50) {
      throw new ValidationError('Pole Nazwisko nie może przekracać 50 znaków!');
    }
    if (obj.lastName !== undefined && obj.lastName !== null && typeof obj.lastName !== 'string') {
      throw new ValidationError('Format danych pola: Nazwisko  jest nieprawidłowy!');
    }
    if (obj.githubUserName !== undefined && obj.githubUserName !== null && obj.githubUserName.length > 100) {
      throw new ValidationError('Pole Github login nie może przekracać 100 znaków!');
    }
    if (obj.githubUserName !== undefined && obj.githubUserName !== null && typeof obj.githubUserName !== 'string') {
      throw new ValidationError('Format danych pola: Github login  jest nieprawidłowy!');
    }
    if (
      obj.expectedTypeWork !== undefined &&
      obj.expectedTypeWork !== null &&
      !Object.values(ExpectedTypeWork).includes(obj.expectedTypeWork)
    ) {
      throw new ValidationError('Oczekiwana wartość jest niepoprawna!');
    }
    if (
      obj.expectedContractType !== undefined &&
      obj.expectedContractType !== null &&
      !Object.values(ExpectedContractType).includes(obj.expectedContractType)
    ) {
      throw new ValidationError('Oczekiwana wartość jest niepoprawna!');
    }
    if (obj.status !== undefined && obj.status !== null && !Object.values(Status).includes(obj.status)) {
      throw new ValidationError('Oczekiwana wartość jest niepoprawna!');
    }
    if (obj.monthsOfCommercialExp !== undefined && obj.monthsOfCommercialExp !== null && obj.monthsOfCommercialExp < 0) {
      throw new ValidationError('Pole Miesięczne doświadczenie komercyjne musi być większe od 0!');
    }
    if (obj.reservedTo !== undefined && obj.reservedTo !== null && !Object.values(Status).includes(obj.status)) {
      throw new ValidationError('Oczekiwana wartość jest niepoprawna!');
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
    this.reservedTo = obj.reservedTo ?? null;
  }

  async insert(): Promise<void> {
    if (!this.id) {
      this.id = uuid();
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

  async updateUserId(): Promise<void> {
    await pool.execute(
      'UPDATE `student` SET `tel` = :tel, `lastName` = :lastName, `firstName` = :firstName, `githubUserName` = :githubUserName, `portfolioUrls` = :portfolioUrls, `projectUrls` = :projectUrls, `bio` = :bio, `expectedTypeWork` = :expectedTypeWork, `targetWorkCity` = :targetWorkCity, `expectedContractType` = :expectedContractType, `expectedSalary` = :expectedSalary, `canTakeApprenticeship` = :canTakeApprenticeship, `monthsOfCommercialExp` = :monthsOfCommercialExp, `education` = :education, `workExperience` = :workExperience, `courses` = :courses ,`status` = :status , `email` = :email  WHERE `user_id` = :user_id',
      {
        id: this.id,
        user_id: this.user_id,
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

  static async getOneById(id: string): Promise<StudentEntity> {
    const [results] = (await pool.execute('SELECT * FROM `student` WHERE `user_id` = :user_id', {
      user_id: id,
    })) as StudentRecordResult;
    return results.length === 0 ? null : new StudentRecord(results[0]);
  }

  static async updateEmail(email: string, user_id: string): Promise<void> {
    await pool.execute('UPDATE `student` SET `email` = :email WHERE `user_id` = :user_id', {
      user_id,
      email,
    });
  }

  static async updateStatusById(id: string, status: string, reservedTo: Date | null, hr_id: string | null) {
    await pool.execute('UPDATE `student` SET `status` = :status, `reservedTo` =:reservedTo,`hr_id` = :hr_id WHERE `user_id` = :user_id', {
      user_id: id,
      status: status,
      reservedTo: reservedTo,
      hr_id: hr_id,
    });
  }
}
