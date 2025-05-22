import ApiCaller from '@/api/apiCaller.tsx';
import { TeacherFormData } from '@/pages/teachers/teachers.tsx';
import { UpdateTeacherPayload } from '@/pages/teachers/blocks/EditTeacher.tsx';

export const callApiGetTeachers = () => {
  return new ApiCaller().setUrl('/teachers').get();
};

export const callApiCreateTeacher = ({ dataCreate }: { dataCreate: TeacherFormData }) => {
  return new ApiCaller().setUrl('/teachers').post(
    {
      data: dataCreate
    }
  );
};

export const callApiUpdateTeacher = ({ teacherId, data }: UpdateTeacherPayload) => {
  return new ApiCaller().setUrl(`/teachers/${teacherId}`).put(
    {
      data: data
    }
  );
};

export const callApiDeleteTeacher = ({ teacherId }: {
  teacherId: number,
}) => {
  return new ApiCaller().setUrl(`/teachers/${teacherId}`).delete();
};
