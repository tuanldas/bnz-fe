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
import { callApiUpdateStudent } from '@/api/student.tsx';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { IStudentData, StudentFormData } from '@/pages/students/students.tsx';

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
  phone: Yup.string()
    .required('Số điện thoại là bắt buộc')
    .matches(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ'),
  classId: Yup.number()
    .required('Lớp là bắt buộc')
    .positive('ID Lớp phải là số dương')
    .integer('ID Lớp phải là số nguyên')
    .typeError('ID Lớp phải là số')
});

export interface UpdateStudentPayload {
  studentId: number;
  data: Partial<StudentFormData>;
}

interface EditStudentProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  editingStudent: IStudentData | null | undefined;
}

const EditStudent = ({ open, onOpenChange, editingStudent }: EditStudentProps) => {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateStudentPayload) => callApiUpdateStudent({
      studentId: payload.studentId,
      data: payload.data
    }),
    onSuccess: (data, variables) => {
      toast.success('Cập nhật học sinh thành công', { position: 'top-right' });
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['students', variables.studentId] });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(`Cập nhật học sinh thất bại: ${error.message || 'Lỗi không xác định'}`);
    }
  });

  const initialValues: StudentFormData = {
    fullName: editingStudent?.fullName ?? '',
    dateOfBirth: editingStudent?.dateOfBirth ?? '',
    email: editingStudent?.email ?? '',
    phone: editingStudent?.phone ?? '',
    classId: editingStudent?.classId ?? 0
  };

  const formik = useFormik<StudentFormData>({
    initialValues,
    validationSchema: schema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting }) => {
      if (editingStudent?.id === undefined) {
        toast.error('Lỗi: Không tìm thấy ID học sinh để cập nhật.');
        setSubmitting(false);
        return;
      }
      const processedValues: StudentFormData = {
        ...values,
        classId: Number(values.classId) || 0
      };
      const payload: UpdateStudentPayload = {
        studentId: editingStudent.id,
        data: processedValues
      };

      updateMutation.mutate(payload, {
        onSettled: () => {
          setSubmitting(false);
        }
      });
    }
  });
  useEffect(() => {
    if (!open) {
      formik.resetForm({ values: initialValues });
    }
  }, [open]);


  const { isPending } = updateMutation;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="container-fixed max-w-[700px] flex flex-col p-10 overflow-hidden [&>button]:hidden">
        <DialogHeader className="p-0 border-0">
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
          <div className="flex items-center justify-between flex-wrap grow gap-5 pb-7.5">
            <div className="flex flex-col justify-center gap-2">
              <h1 className="text-xl font-semibold leading-none text-gray-900">Cập nhật thông tin học sinh</h1>
            </div>
            <button className="btn btn-sm btn-light" onClick={() => onOpenChange(false)}>Close</button>
          </div>
        </DialogHeader>
        <DialogBody className="scrollable-y py-0 mb-5 ps-0 pe-3 -me-7">
          {editingStudent && (
            <form className={'grid gap-5'} onSubmit={formik.handleSubmit}>
              <div className="w-full">
                <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                  <label className="form-label flex items-center gap-1 max-w-56 shrink-0">Họ và Tên</label>
                  <div className={'w-full'}>
                    <input
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
                  <label className="form-label flex items-center gap-1 max-w-56 shrink-0">Ngày Sinh</label>
                  <div className={'w-full'}>
                    <input
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
                  <label className="form-label flex items-center gap-1 max-w-56 shrink-0">Email</label>
                  <div className={'w-full'}>
                    <input
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
                  <label className="form-label flex items-center gap-1 max-w-56 shrink-0">Điện thoại</label>
                  <div className={'w-full'}>
                    <input
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
              <div className="w-full">
                <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                  <label className="form-label flex items-center gap-1 max-w-56 shrink-0">ID Lớp</label>
                  <div className={'w-full'}>
                    {/* !!! THAY THẾ BẰNG SELECT DROPDOWN !!! */}
                    <input
                      className={clsx('input form-control', { 'is-invalid': formik.touched.classId && formik.errors.classId })}
                      type="number"
                      placeholder="Nhập ID lớp học"
                      disabled={isPending}
                      {...formik.getFieldProps('classId')}
                    />
                    <small className="text-muted">Lưu ý: Nên dùng chức năng chọn lớp.</small>
                    {formik.touched.classId && formik.errors.classId && (
                      <span role="alert" className="text-danger text-xs mt-1">{formik.errors.classId}</span>)}
                  </div>
                </div>
              </div>
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

export { EditStudent };
