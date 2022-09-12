export interface HrEntity {
  id?: string;
  user_id: string;
  email: string;
  fullName: string;
  company: string;
  maxReservedStudents: number;
  img_src: null | string;
}


export interface HrFrontEntity {
  id: string;
  user_id: string;
  email: string;
  fullName: string;
  company: string;
  maxReservedStudents: number;
  img_src: null | string;
  reservedStudents: number;
}