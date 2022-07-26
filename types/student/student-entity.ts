export enum ExpectedTypeWork {
  OnPlace = 'Na miejscu',
  ReadyToMove = 'Gotowość do przeprowadzki',
  OnlyRemote = 'Praca zdalna',
  Hybrid = 'Hybrydowo',
  DoesNotMatter = 'Wszystko jedno',
}

export enum ExpectedContractType {
  EmploymentContract = 'Tylko UoP',
  B2B = 'Możliwa B2B',
  ContractOfServices = 'Możliwe UZ/UoD',
  DoesNotMatter = 'Brak preferencji',
}

export enum Status {
  Available = 'Dostępny',
  Hired = 'Zatrudniony',
}

export interface StudentImport {
  user_id: string;
  email: string;
  courseCompletion: number;
  courseEngagement: number;
  projectDegree: number;
  teamProjectDegree: number;
  bonusProjectUrls: string;
}

export interface StudentGetAll {
  user_id: string;
  courseCompletion: number;
  courseEngagement: number;
  projectDegree: number;
  teamProjectDegree: number;
  firstName: string;
  lastName: string;
  expectedTypeWork: ExpectedTypeWork;
  targetWorkCity: string | null;
  expectedContractType: ExpectedContractType;
  expectedSalary: number | null;
  canTakeApprenticeship: number;
  monthsOfCommercialExp: number;
}

export interface SelectedStudents {
  user_id: string;
  courseCompletion: number;
  courseEngagement: number;
  projectDegree: number;
  teamProjectDegree: number;
  firstName: string;
  lastName: string;
  expectedTypeWork: ExpectedTypeWork;
  targetWorkCity: string | null;
  expectedContractType: ExpectedContractType;
  expectedSalary: number | null;
  canTakeApprenticeship: number;
  monthsOfCommercialExp: number;
  githubUsername: string;
}

export interface SingleStudentImport {
  email: string;
  courseCompletion: number;
  courseEngagement: number;
  projectDegree: number;
  teamProjectDegree: number;
  bonusProjectUrls: string;
}

export interface FilterReqBodyDataId {
  courseCompletion: number | null;
  courseEngagement: number | null;
  projectDegree: number | null;
  teamProjectDegree: number | null;
  expectedTypeWork: string[] | [];
  expectedContractType: string[] | [];
  minSalary: string;
  maxSalary: string;
  canTakeApprenticeship: string | null;
  monthsOfCommercialExp: string | null;
  hr_id: string;
}

export interface FilterReqBody {
  courseCompletion: number | null;
  courseEngagement: number | null;
  projectDegree: number | null;
  teamProjectDegree: number | null;
  expectedTypeWork: string[] | [];
  expectedContractType: string[] | [];
  minSalary: string;
  maxSalary: string;
  canTakeApprenticeship: string | null;
  monthsOfCommercialExp: string | null;
}

export interface StudentId {
  id: string;
}

export interface StudentEntityImport {
  id: string;
  email: string;
  courseCompletion: number;
  courseEngagement: number;
  projectDegree: number;
  teamProjectDegree: number;
  bonusProjectUrls: string;
}

export interface studentEntityFront {
  email: string;
  courseCompletion: number;
  courseEngagement: number;
  projectDegree: number;
  teamProjectDegree: number;
  bonusProjectUrls: string;
  tel: number | null;
  firstName: string | null;
  lastName: string | null;
  githubUserName: string | null;
  portfolioUrls?: string | null;
  projectUrls: string | null;
  bio: string | null;
  expectedTypeWork: ExpectedTypeWork | null;
  targetWorkCity: string | null;
  expectedContractType: ExpectedContractType | null;
  expectedSalary: number | null;
  canTakeApprenticeship: number | null;
  monthsOfCommercialExp: number | null;
  education: string | null;
  workExperience: string | null;
  courses: string | null;
  status: Status | null;
}

export interface projectUrlMapEntity {
  value: string;
}

export interface portfolioUrlMapEntity {
  value: string;
}

export interface studentMapFilterTypeWork {
  id: string;
  value: string;
}

export interface getAllFilter {
  user_id: string;
  firstName?: string;
  lastName?: string;
  courseCompletion: number;
  courseEngagement: number;
  projectDegree: number;
  teamProjectDegree: number;
  expectedTypeWork?: ExpectedTypeWork;
  expectedContractType?: ExpectedContractType;
  canTakeApprenticeship?: number;
  monthsOfCommercialExp?: number;
  expectedSalary?: number;
}

export interface StudentEntity {
  id?: string;
  email?: string;
  courseCompletion?: number;
  courseEngagement?: number;
  projectDegree?: number;
  teamProjectDegree?: number;
  bonusProjectUrls?: string;
  tel?: number | null;
  firstName?: string | null;
  lastName?: string | null;
  githubUserName?: string | null;
  portfolioUrls?: string | null;
  projectUrls?: string | null;
  bio?: string | null;
  expectedTypeWork?: ExpectedTypeWork | null;
  targetWorkCity?: string | null;
  expectedContractType?: ExpectedContractType | null;
  expectedSalary?: number | null;
  canTakeApprenticeship?: number | null;
  monthsOfCommercialExp?: number | null;
  education?: string | null;
  workExperience?: string | null;
  courses?: string | null;
  status?: Status | null;
  user_id?: string | null;
}

export interface StudentEntityFront extends StudentEntity {
  firstName:string;
  reservedTo: Date;
}
