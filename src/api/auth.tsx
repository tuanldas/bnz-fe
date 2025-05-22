import { type UserModel } from '@/auth';
import ApiCaller from '@/api/apiCaller.tsx';
import { AxiosResponse } from 'axios';

export interface RegistrationPayload {
  username?: string;
  password: string;
  email: string;
}

export interface RegistrationResponse {
  success: boolean;
  message: string;
  user?: UserModel;
}

export const callApiDoActualRegistration = async (
  payload: RegistrationPayload
): Promise<AxiosResponse<any>> => {
  try {
    const apiResponse = await new ApiCaller()
      .setUrl('/auth/register')
      .post({data: payload});
    return apiResponse;
  } catch (error: any) {
    if (error && typeof error.response.data.message === 'string') {
      throw new Error(error.response.data.message);
    }
    throw new Error('Đăng ký tài khoản thất bại do lỗi không mong muốn từ ApiCaller.');
  }
};
