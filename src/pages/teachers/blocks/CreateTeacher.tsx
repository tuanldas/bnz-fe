import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import clsx from 'clsx';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { callApiCreateTeacher } from '@/api/teacher.tsx';
import { toast } from 'sonner';

interface TeacherFormData {
  fullName: string;
  dateOfBirth: string;
  email: string;
  password?: string;
  phone: string;
}

const initialValues: TeacherFormData = {
  fullName: '',
  dateOfBirth: '',
  email: '',
  password: '',
  phone: ''
};

const schema = Yup.object().shape({
  fullName: Yup.string()
    .min(3, 'Họ tên tối thiểu 3 ký tự')
    .max(50, 'Họ tên tối đa 50 ký tự')
    .required('Họ tên là bắt buộc'),
  dateOfBirth: Yup.string()
    .required('Ngày sinh là bắt buộc')
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Định dạng ngày YYYY-MM-DD'),
  email: Yup.string()
    .email('Email không hợp lệ')
    .required('Email là bắt buộc'),
  password: Yup.string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .required('Mật khẩu là bắt buộc'),
  phone: Yup.string()
    .required('Số điện thoại là bắt buộc')
    .matches(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ')
});

interface CreateTeacherPayload {
  dataCreate: TeacherFormData;
}

interface CreateTeacherProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const CreateTeacher = ({ onOpenChange, open }: CreateTeacherProps) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (payload: CreateTeacherPayload) => callApiCreateTeacher(payload),
    onSuccess: () => {
      toast.success('Tạo giảng viên thành công!');
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(`Tạo giảng viên thất bại: ${error?.response?.data?.message || error?.message || 'Lỗi không xác định'}`);
    }
  });

  const formik = useFormik<TeacherFormData>({
    initialValues,
    validationSchema: schema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      const payload: CreateTeacherPayload = { dataCreate: values };
      createMutation.mutate(payload, {
        onSuccess: () => {
          resetForm();
        },
        onSettled: () => {
          setSubmitting(false);
        }
      });
    }
  });

  const { isPending } = createMutation;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        formik.resetForm();
      }
      onOpenChange(isOpen);
    }}>
      <DialogContent className="container-fixed max-w-[700px] flex flex-col p-10 overflow-hidden [&>button]:hidden">
        <DialogHeader className="p-0 border-0">
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
          <div className="flex items-center justify-between flex-wrap grow gap-5 pb-7.5">
            <div className="flex flex-col justify-center gap-2">
              <h1 className="text-xl font-semibold leading-none text-gray-900">Tạo giảng viên</h1>
            </div>
            <button className="btn btn-sm btn-light" type="button" onClick={() => onOpenChange(false)}>Đóng</button>
          </div>
        </DialogHeader>
        <DialogBody className="scrollable-y py-0 mb-5 ps-0 pe-3 -me-7">
          <form className={'grid gap-5'} onSubmit={formik.handleSubmit} noValidate>
            <div className="w-full">
              <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                <label htmlFor="fullName" className="form-label flex items-center gap-1 max-w-56 shrink-0">Họ và
                  Tên</label>
                <div className={'w-full'}>
                  <input
                    id="fullName"
                    className={clsx('input form-control', { 'is-invalid': formik.touched.fullName && formik.errors.fullName })}
                    type="text"
                    disabled={isPending}
                    {...formik.getFieldProps('fullName')}
                  />
                  {formik.touched.fullName && formik.errors.fullName && (
                    <span role="alert" className="text-danger text-xs mt-1">{formik.errors.fullName}</span>)}
                </div>
              </div>
            </div>

            <div className="w-full">
              <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                <label htmlFor="dateOfBirth" className="form-label flex items-center gap-1 max-w-56 shrink-0">Ngày
                  Sinh</label>
                <div className={'w-full'}>
                  <input
                    id="dateOfBirth"
                    className={clsx('input form-control', { 'is-invalid': formik.touched.dateOfBirth && formik.errors.dateOfBirth })}
                    type="date"
                    disabled={isPending}
                    {...formik.getFieldProps('dateOfBirth')}
                  />
                  {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
                    <span role="alert" className="text-danger text-xs mt-1">{formik.errors.dateOfBirth}</span>)}
                </div>
              </div>
            </div>

            <div className="w-full">
              <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                <label htmlFor="email" className="form-label flex items-center gap-1 max-w-56 shrink-0">Email</label>
                <div className={'w-full'}>
                  <input
                    id="email"
                    className={clsx('input form-control', { 'is-invalid': formik.touched.email && formik.errors.email })}
                    type="email"
                    disabled={isPending}
                    {...formik.getFieldProps('email')}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <span role="alert" className="text-danger text-xs mt-1">{formik.errors.email}</span>)}
                </div>
              </div>
            </div>

            <div className="w-full">
              <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                <label htmlFor="password" className="form-label flex items-center gap-1 max-w-56 shrink-0">Mật
                  khẩu</label>
                <div className={'w-full'}>
                  <input
                    id="password"
                    className={clsx('input form-control', { 'is-invalid': formik.touched.password && formik.errors.password })}
                    type="password"
                    disabled={isPending}
                    {...formik.getFieldProps('password')}
                    autoComplete="new-password"
                  />
                  {formik.touched.password && formik.errors.password && (
                    <span role="alert" className="text-danger text-xs mt-1">{formik.errors.password}</span>)}
                </div>
              </div>
            </div>

            <div className="w-full">
              <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                <label htmlFor="phone" className="form-label flex items-center gap-1 max-w-56 shrink-0">Điện
                  thoại</label>
                <div className={'w-full'}>
                  <input
                    id="phone"
                    className={clsx('input form-control', { 'is-invalid': formik.touched.phone && formik.errors.phone })}
                    type="tel"
                    disabled={isPending}
                    {...formik.getFieldProps('phone')}
                  />
                  {formik.touched.phone && formik.errors.phone && (
                    <span role="alert" className="text-danger text-xs mt-1">{formik.errors.phone}</span>)}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2.5">
              <button type={'submit'} className="btn btn-primary"
                      disabled={isPending || !formik.isValid || !formik.dirty}>
                {isPending ? 'Đang tạo...' : 'Tạo giảng viên'}
              </button>
            </div>
          </form>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};

export { CreateTeacher };
