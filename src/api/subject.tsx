import ApiCaller from '@/api/apiCaller.tsx';
import { SubjectFormData, UpdateSubjectPayload } from '@/pages/subjects/subjects.types.ts';

export const callApiGetSubjects = () => {
  return new ApiCaller().setUrl('/subjects').get();
};

export const callApiCreateSubject = ({ dataCreate }: { dataCreate: SubjectFormData }) => {
  return new ApiCaller().setUrl('/subjects').post(
    {
      data: dataCreate
    }
  );
};

export const callApiUpdateSubject = ({ subjectId, data }: UpdateSubjectPayload) => {
  return new ApiCaller().setUrl(`/subjects/${subjectId}`).put(
    {
      data: data
    }
  );
};

export const callApiDeleteSubject = ({ subjectId }: {
  subjectId: number,
}) => {
  return new ApiCaller().setUrl(`/subjects/${subjectId}`).delete();
};
