import ApiCaller from '@/api/apiCaller.tsx';
import { StudentFormData } from '@/pages/students/students.tsx';
import { UpdateStudentPayload } from '@/pages/students/blocks/EditStudent.tsx';

export const callApiGetStudents = () => {
  return new ApiCaller().setUrl('/students').get();
};

export const callApiCreateStudent = ({ dataCreate }: { dataCreate: StudentFormData }) => {
  return new ApiCaller().setUrl('/students').post(
    {
      data: dataCreate
    }
  );
};

export const callApiUpdateStudent = ({ studentId, data }: UpdateStudentPayload) => {
  return new ApiCaller().setUrl(`/students/${studentId}`).put(
    {
      data: data
    }
  );
};

export const callApiDeleteStudent = ({ studentId }: {
  studentId: number,
}) => {
  return new ApiCaller().setUrl(`/students/${studentId}`).delete();
};
