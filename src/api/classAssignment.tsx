import ApiCaller from '@/api/apiCaller.tsx';

export interface IClassAssignmentPayload {
  classId: number;
  subjectId: number;
  teacherId: number;
}

export const callApiCreateClassAssignment = (payload: IClassAssignmentPayload) => {
  return new ApiCaller().setUrl('/class-assignments').post(
    {
      data: payload
    }
  );
};
