export interface ISubjectData {
  id: number;
  name: string;
}

export type SubjectFormData = Pick<ISubjectData, 'name'>;

export type SubjectIdentifier = Pick<ISubjectData, 'id' | 'name'>;

export interface ApiSubjectsResponse {
  data: {
    data: ISubjectData[];
    links?: any;
    meta?: any;
  };
  message?: string;
}

export interface CreateSubjectPayload {
  dataCreate: SubjectFormData;
}

export interface UpdateSubjectPayload {
  subjectId: number;
  data: Partial<SubjectFormData>;
}
