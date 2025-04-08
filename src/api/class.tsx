import ApiCaller from '@/api/apiCaller.tsx';

export const callApiGetStudents = () => {
    return new ApiCaller().setUrl('/classes').get();
};
