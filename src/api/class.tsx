import ApiCaller from '@/api/apiCaller.tsx';

export const callApiGetClasses = () => {
  return new ApiCaller().setUrl('/classes').get();
};

export const callApiCreateClass = ({ dataCreate }: { dataCreate: { name: string, description: string } }) => {
  return new ApiCaller().setUrl('/classes').post(
    {
      data: dataCreate
    }
  );
};

export const callApiUpdateClass = ({ classId, data }: {
  classId: number,
  data: { name: string, description: string }
}) => {
  return new ApiCaller().setUrl(`/classes/${classId}`).put(
    {
      data: data
    }
  );
};

export const callApiDeleteClass = ({ classId }: {
  classId: number,
}) => {
  return new ApiCaller().setUrl(`/classes/${classId}`).delete();
};
