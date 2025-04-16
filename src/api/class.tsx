import ApiCaller from '@/api/apiCaller.tsx';

export const callApiGetClasses = () => {
    return new ApiCaller().setUrl('/classes').get();
};

export const callApiCreateClass = ({dataCreate}: { dataCreate: { name: string, description: string } }) => {
    return new ApiCaller().setUrl('/classes').post(
        {
            data: dataCreate,
        }
    );
};
