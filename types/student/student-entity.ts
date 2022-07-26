export enum ExpectedTypeWork {
    OnPlace= 'Na miejscu',
    ReadyToMove = 'Gotowość do przeprowadzki',
    OnlyRemote = 'Praca zdalna',
    Hybrid = 'Hybrydowo',
    DoesNotMatter = 'Wszystko jedno',
}

export enum ExpectedContractType {
    EmploymentContract ='Tylko UoP',
    B2B = 'Możliwa B2B',
    ContractOfServices = 'Możliwe UZ/UoD',
    DoesNotMatter = 'Brak preferencji',
}

export enum Status {
    Available = 'Dostępny',
    Reserved = 'W trakcie rozmowy',
    Hired = 'Zatrudniony',

}

export interface StudentEntityImport {
    id: string;
    email: string;
    courseCompletion: number;
    courseEngagement: number;
    projectDegree: number;
    teamProjectDegree: number;
    bonusProjectUrls: string[];
}

export interface StudentEntity extends StudentEntityImport {
    tel?: number;
    firstName: string;
    lastName: string;
    githubUserName: string;
    portfolioUrls?: string[];
    projectUrls: string[];
    bio?: string;
    expectedTypeWork:ExpectedTypeWork;
    targetWorkCity?: string;
    expectedContractType: ExpectedContractType;
    expectedSalary?: number;
    canTakeApprenticeship: boolean;
    monthsOfCommercialExp: number;
    education?: string;
    workExperience?: string;
    courses?: string;
    status: Status;
    user_id?: string;
    hr_id?: string;
}