import {
  Dialog, DialogBody, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from '@/components/ui/dialog';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import clsx from 'clsx';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { SubjectFormData, CreateSubjectPayload } from '../subjects.types';
import { callApiCreateSubject } from '@/api/subject';

const initialValues: SubjectFormData = {
  name: '',
};

const schema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Tên môn học tối thiểu 2 ký tự')
    .max(100, 'Tên môn học tối đa 100 ký tự')
    .required('Tên môn học là bắt buộc'),
});

interface CreateSubjectProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const CreateSubject = ({ open, onOpenChange }: CreateSubjectProps) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (payload: CreateSubjectPayload) => callApiCreateSubject(payload),
    onSuccess: () => {
      toast.success('Tạo môn học thành công!');
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(`Tạo môn học thất bại: ${error?.response?.data?.message || error?.message || 'Lỗi không xác định'}`);
    },
  });

  const formik = useFormik<SubjectFormData>({
    initialValues,
    validationSchema: schema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      const payload: CreateSubjectPayload = { dataCreate: values };
      createMutation.mutate(payload, {
        onSuccess: () => {
          resetForm();
        },
        onSettled: () => {
          setSubmitting(false);
        },
      });
    },
  });

  const { isPending } = createMutation;

  const handleOpenChangeWithReset = (isOpen: boolean) => {
    if (!isOpen) {
      formik.resetForm();
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChangeWithReset}>
      <DialogContent className="container-fixed max-w-[500px] flex flex-col p-6 sm:p-10 overflow-hidden">
        <DialogHeader className="p-0 border-0 mb-4">
          <DialogTitle className="text-xl font-semibold">Tạo Môn học mới</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Vui lòng nhập thông tin cho môn học.
          </DialogDescription>
        </DialogHeader>
        <DialogBody className="scrollable-y py-0">
          <form className="grid gap-5" onSubmit={formik.handleSubmit} noValidate>
            <div className="w-full">
              <label htmlFor="subjectName" className="form-label mb-1 block text-sm font-medium text-gray-700">
                Tên Môn học
              </label>
              <input
                id="subjectName"
                className={clsx(
                  'input form-control w-full',
                  { 'is-invalid': formik.touched.name && formik.errors.name }
                )}
                type="text"
                disabled={isPending}
                {...formik.getFieldProps('name')}
              />
              {formik.touched.name && formik.errors.name && (
                <span role="alert" className="text-danger text-xs mt-1">
                  {formik.errors.name}
                </span>
              )}
            </div>

            <div className="flex justify-end items-center gap-3 pt-4 mt-2 border-t">
              <button
                type="button"
                className="btn btn-light"
                onClick={() => handleOpenChangeWithReset(false)}
                disabled={isPending}
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isPending || !formik.isValid || !formik.dirty}
              >
                {isPending ? 'Đang lưu...' : 'Lưu Môn học'}
              </button>
            </div>
          </form>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};
