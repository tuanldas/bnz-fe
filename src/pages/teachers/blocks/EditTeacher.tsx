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
import { toast } from 'sonner';
import { useEffect } from 'react';
import { ITeacherData, TeacherFormData } from '@/pages/teachers/teachers.tsx'; // Đảm bảo TeacherFormData không còn yêu cầu classId hoặc classId là optional nếu vẫn dùng ở nơi khác
import { callApiUpdateTeacher } from '@/api/teacher.tsx';

// 1. Xóa classId khỏi schema validation
const schema = Yup.object().shape({
  fullName: Yup.string()
    .min(3, 'Họ tên tối thiểu 3 ký tự')
    .max(50, 'Họ tên tối đa 50 ký tự')
    .required('Họ tên là bắt buộc'),
  dateOfBirth: Yup.string()
    .required('Ngày sinh là bắt buộc')
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Định dạng ngày Plymouth-MM-DD'),
  email: Yup.string()
    .email('Email không hợp lệ')
    .required('Email là bắt buộc'),
  password: Yup.string()
    .transform(value => (value === '' ? undefined : value))
    .min(8, 'Mật khẩu mới phải có ít nhất 8 ký tự'),
  phone: Yup.string()
    .required('Số điện thoại là bắt buộc')
    .matches(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ')
});

export interface UpdateTeacherPayload {
  teacherId: number;
  data: Partial<Omit<TeacherFormData, 'classId'>>; // Omit classId nếu TeacherFormData vẫn có
}

interface EditTeacherProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  editingTeacher: ITeacherData | null | undefined; // ITeacherData có thể vẫn có classId từ backend
}

const EditTeacher = ({ open, onOpenChange, editingTeacher }: EditTeacherProps) => {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateTeacherPayload) => callApiUpdateTeacher({
      teacherId: payload.teacherId,
      data: payload.data
    }),
    onSuccess: (_data, variables) => {
      toast.success('Cập nhật giảng viên thành công', { position: 'top-right' });
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      queryClient.invalidateQueries({ queryKey: ['teachers', variables.teacherId] });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(`Cập nhật giảng viên thất bại: ${error?.response?.data?.message || error.message || 'Lỗi không xác định'}`);
    }
  });

  // 2. Xóa classId khỏi initialValues
  const initialValues: Omit<TeacherFormData, 'classId'> = {
    fullName: editingTeacher?.fullName ?? '',
    dateOfBirth: editingTeacher?.dateOfBirth ?? '',
    email: editingTeacher?.email ?? '',
    password: '',
    phone: editingTeacher?.phone ?? ''
  };

  const formik = useFormik<Omit<TeacherFormData, 'classId'>>({
    initialValues,
    validationSchema: schema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting }) => {
      if (editingTeacher?.id === undefined) {
        toast.error('Lỗi: Không tìm thấy ID giảng viên để cập nhật.');
        setSubmitting(false);
        return;
      }

      // 3. Xóa classId khỏi dataToUpdate
      const dataToUpdate: Partial<Omit<TeacherFormData, 'classId'>> = {
        fullName: values.fullName,
        dateOfBirth: values.dateOfBirth,
        email: values.email,
        phone: values.phone
      };

      if (values.password && values.password.trim() !== '') {
        dataToUpdate.password = values.password;
      }

      const payload: UpdateTeacherPayload = {
        teacherId: editingTeacher.id,
        data: dataToUpdate
      };

      updateMutation.mutate(payload, {
        onSettled: () => {
          setSubmitting(false);
        }
      });
    }
  });

  // 5. Xóa classId khỏi logic useEffect
  useEffect(() => {
    if (open && editingTeacher) {
      formik.setValues({
        fullName: editingTeacher.fullName,
        dateOfBirth: editingTeacher.dateOfBirth,
        email: editingTeacher.email,
        password: '',
        phone: editingTeacher.phone
      }, false);
    } else if (!open) {
      formik.resetForm();
    }
  }, [open, editingTeacher, formik.setValues, formik.resetForm]);


  const { isPending } = updateMutation;

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
              <h1 className="text-xl font-semibold leading-none text-gray-900">Cập nhật thông tin giảng viên</h1>
            </div>
            <button className="btn btn-sm btn-light" type="button" onClick={() => onOpenChange(false)}>Đóng</button>
          </div>
        </DialogHeader>
        <DialogBody className="scrollable-y py-0 mb-5 ps-0 pe-3 -me-7">
          {editingTeacher && (
            <form className={'grid gap-5'} onSubmit={formik.handleSubmit} noValidate>
              <div className="w-full">
                <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                  <label htmlFor="edit-fullName" className="form-label flex items-center gap-1 max-w-56 shrink-0">Họ và
                    Tên</label>
                  <div className={'w-full'}>
                    <input
                      id="edit-fullName"
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
                  <label htmlFor="edit-dateOfBirth" className="form-label flex items-center gap-1 max-w-56 shrink-0">Ngày
                    Sinh</label>
                  <div className={'w-full'}>
                    <input
                      id="edit-dateOfBirth"
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
                  <label htmlFor="edit-email"
                         className="form-label flex items-center gap-1 max-w-56 shrink-0">Email</label>
                  <div className={'w-full'}>
                    <input
                      id="edit-email"
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
                  <label htmlFor="edit-password" className="form-label flex items-center gap-1 max-w-56 shrink-0">Mật
                    khẩu mới</label>
                  <div className={'w-full'}>
                    <input
                      id="edit-password"
                      className={clsx('input form-control', { 'is-invalid': formik.touched.password && formik.errors.password })}
                      type="password"
                      placeholder="Để trống nếu không muốn thay đổi"
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
                  <label htmlFor="edit-phone" className="form-label flex items-center gap-1 max-w-56 shrink-0">Điện
                    thoại</label>
                  <div className={'w-full'}>
                    <input
                      id="edit-phone"
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
              {/* 4. Xóa phần JSX của classId */}
              <div className="flex justify-end pt-2.5">
                <button type={'submit'} className="btn btn-primary"
                        disabled={isPending || !formik.dirty || !formik.isValid}>
                  {isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          )}
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};

export { EditTeacher };
