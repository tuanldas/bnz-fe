import { useEffect } from 'react';
import {
  Dialog, DialogBody, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from '@/components/ui/dialog';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import clsx from 'clsx';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ISubjectData, SubjectFormData, UpdateSubjectPayload } from '../subjects.types';
import { callApiUpdateSubject } from '@/api/subject';

const schema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Tên môn học tối thiểu 2 ký tự')
    .max(100, 'Tên môn học tối đa 100 ký tự')
    .required('Tên môn học là bắt buộc'),
});

interface EditSubjectProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  editingSubject: ISubjectData | null | undefined;
  onClose?: () => void;
}

export const EditSubject = ({ open, onOpenChange, editingSubject, onClose }: EditSubjectProps) => {
  const queryClient = useQueryClient();

  const initialValues: SubjectFormData = {
    name: editingSubject?.name ?? '',
  };

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateSubjectPayload) => callApiUpdateSubject(payload),
    onSuccess: (_data, variables) => {
      toast.success('Cập nhật môn học thành công!');
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      queryClient.invalidateQueries({ queryKey: ['subjects', variables.subjectId] });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(`Cập nhật môn học thất bại: ${error?.response?.data?.message || error.message || 'Lỗi không xác định'}`);
    },
  });

  const formik = useFormik<SubjectFormData>({
    initialValues,
    validationSchema: schema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting }) => {
      if (!editingSubject?.id) {
        toast.error('Lỗi: Không tìm thấy ID môn học để cập nhật.');
        setSubmitting(false);
        return;
      }

      const dataToUpdate: Partial<SubjectFormData> = {};
      if (values.name !== editingSubject.name) {
        dataToUpdate.name = values.name;
      }

      if (Object.keys(dataToUpdate).length === 0) {
        toast.info('Không có thay đổi nào để lưu.');
        onOpenChange(false);
        setSubmitting(false);
        return;
      }

      const payload: UpdateSubjectPayload = {
        subjectId: editingSubject.id,
        data: dataToUpdate,
      };

      updateMutation.mutate(payload, {
        onSettled: () => {
          setSubmitting(false);
        },
      });
    },
  });

  const handleOpenChangeWithReset = (isOpen: boolean) => {
    if (!isOpen) {
      formik.resetForm();
      if (onClose) onClose();
    }
    onOpenChange(isOpen);
  };

  useEffect(() => {
    if (open && editingSubject) {
      formik.setValues({ name: editingSubject.name }, false);
    } else if (!open) {
      formik.resetForm();
    }
  }, [open, editingSubject, formik.setValues, formik.resetForm]);


  const { isPending } = updateMutation;

  return (
    <Dialog open={open} onOpenChange={handleOpenChangeWithReset}>
      <DialogContent className="container-fixed max-w-[500px] flex flex-col p-6 sm:p-10 overflow-hidden">
        <DialogHeader className="p-0 border-0 mb-4">
          <DialogTitle className="text-xl font-semibold">Chỉnh sửa Môn học</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Cập nhật thông tin cho môn học: {editingSubject?.name}
          </DialogDescription>
        </DialogHeader>
        <DialogBody className="scrollable-y py-0">
          {editingSubject && (
            <form className="grid gap-5" onSubmit={formik.handleSubmit} noValidate>
              <div className="w-full">
                <label htmlFor="editSubjectName" className="form-label mb-1 block text-sm font-medium text-gray-700">
                  Tên Môn học
                </label>
                <input
                  id="editSubjectName"
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
