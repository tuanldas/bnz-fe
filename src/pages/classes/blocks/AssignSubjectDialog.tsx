import { Dialog, DialogBody, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import clsx from 'clsx';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ISubjectData, ITeacherData, IUsersData } from '@/pages/classes/blocks/List.tsx';
import { callApiCreateClassAssignment, IClassAssignmentPayload } from '@/api/classAssignment';

const assignmentSchema = Yup.object().shape({
  subjectId: Yup.string()
    .required('Vui lòng chọn môn học')
    .test('is-not-empty', 'Vui lòng chọn môn học', value => !!value && value !== ''),
  teacherId: Yup.string()
    .required('Vui lòng chọn giáo viên')
    .test('is-not-empty', 'Vui lòng chọn giáo viên', value => !!value && value !== '')
});

interface AssignSubjectDialogProps {
  open: boolean;
  onOpenChange: () => void;
  classItem?: IUsersData;
  subjects?: ISubjectData[];
  isLoadingSubjects?: boolean;
  teachers?: ITeacherData[];
  isLoadingTeachers?: boolean;
}

const AssignSubjectDialog = ({
                               open,
                               onOpenChange,
                               classItem,
                               subjects,
                               isLoadingSubjects,
                               teachers,
                               isLoadingTeachers
                             }: AssignSubjectDialogProps) => {
  const queryClient = useQueryClient();

  const assignMutation = useMutation({
    mutationFn: callApiCreateClassAssignment,
    onSuccess: () => {
      toast.success('Gán môn học cho lớp thành công!');
      queryClient.invalidateQueries({ queryKey: ['classDetails', classItem?.id] });
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      onOpenChange();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Gán môn học thất bại.');
    }
  });

  const formik = useFormik({
    initialValues: {
      subjectId: '',
      teacherId: ''
    },
    validationSchema: assignmentSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      if (!classItem?.id) {
        toast.error('Lỗi: Không tìm thấy ID của lớp.');
        setSubmitting(false);
        return;
      }
      if (values.subjectId === '' || values.teacherId === '') {
        if (values.subjectId === '') formik.setFieldError('subjectId', 'Vui lòng chọn môn học');
        if (values.teacherId === '') formik.setFieldError('teacherId', 'Vui lòng chọn giáo viên');
        setSubmitting(false);
        return;
      }

      const payload: IClassAssignmentPayload = {
        classId: classItem.id,
        subjectId: Number(values.subjectId),
        teacherId: Number(values.teacherId)
      };
      assignMutation.mutate(payload, {
        onSettled: () => {
          setSubmitting(false);
        }
      });
    }
  });

  const handleCloseAndReset = () => {
    onOpenChange();
    formik.resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={handleCloseAndReset}>
      <DialogContent className="container-fixed max-w-[700px] flex flex-col p-10 overflow-hidden [&>button]:hidden">
        <DialogHeader className="p-0 border-0">
          <div className="flex items-center justify-between flex-wrap grow gap-5 pb-7.5">
            <div className="flex flex-col justify-center gap-2">
              <h1 className="text-xl font-semibold leading-none text-gray-900">
                Thêm môn học cho lớp: {classItem?.name || ''}
              </h1>
            </div>
            <button type="button" className="btn btn-sm btn-light" onClick={handleCloseAndReset}>
              Đóng
            </button>
          </div>
        </DialogHeader>
        <DialogBody className="scrollable-y py-0 mb-5 ps-0 pe-3 -me-7">
          <form className={'grid gap-5'} onSubmit={formik.handleSubmit}>
            <div className="w-full">
              <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                <label htmlFor="subjectId" className="form-label flex items-center gap-1 max-w-56">Môn học</label>
                <div className={'w-full'}>
                  <select
                    id="subjectId"
                    name="subjectId"
                    className={clsx('input form-control', {
                      'is-invalid': formik.touched.subjectId && formik.errors.subjectId
                    })}
                    value={formik.values.subjectId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={isLoadingSubjects || assignMutation.isPending}
                  >
                    <option value="" disabled>
                      {isLoadingSubjects ? 'Đang tải môn học...' : (subjects && subjects.length > 0 ? '-- Chọn môn học --' : 'Không có môn học')}
                    </option>
                    {subjects?.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                  {formik.touched.subjectId && formik.errors.subjectId && (
                    <span role="alert" className="text-danger text-xs mt-1">{formik.errors.subjectId}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full">
              <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                <label htmlFor="teacherId" className="form-label flex items-center gap-1 max-w-56">Giáo viên</label>
                <div className={'w-full'}>
                  <select
                    id="teacherId"
                    name="teacherId"
                    className={clsx('input form-control', {
                      'is-invalid': formik.touched.teacherId && formik.errors.teacherId
                    })}
                    value={formik.values.teacherId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={isLoadingTeachers || assignMutation.isPending}
                  >
                    <option value="" disabled>
                      {isLoadingTeachers ? 'Đang tải giáo viên...' : (teachers && teachers.length > 0 ? '-- Chọn giáo viên --' : 'Không có giáo viên')}
                    </option>
                    {teachers?.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.fullName}
                      </option>
                    ))}
                  </select>
                  {formik.touched.teacherId && formik.errors.teacherId && (
                    <span role="alert" className="text-danger text-xs mt-1">{formik.errors.teacherId}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-2.5">
              <Button
                type="submit"
                className="btn btn-primary"
                disabled={assignMutation.isPending || formik.isSubmitting || isLoadingSubjects || isLoadingTeachers}
              >
                {assignMutation.isPending ? 'Đang lưu...' : 'Lưu'}
              </Button>
            </div>
          </form>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};

export { AssignSubjectDialog };
