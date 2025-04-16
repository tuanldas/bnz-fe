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
import { callApiCreateClass } from '@/api/class.tsx';
import { toast } from 'sonner';

const schema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Tên lớp tối thiểu 3 ký tự')
    .max(50, 'Tên lớp tối đa 50 ký tự')
    .required('Tên lớp là bắt buộc'),
  description: Yup.string().max(200, 'Mô tả tối đa 200 ký tự')
});

const initialValues = {
  name: '',
  description: ''
};

interface CreateClassFormValues {
  name: string;
  description: string;
}

interface CreateClassPayload {
  dataCreate: CreateClassFormValues;
}

interface CreateProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const Create = ({ onOpenChange, open }: CreateProps) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (payload: CreateClassPayload) => callApiCreateClass(payload),
    onSuccess: (data, variables) => {
      toast.success('Tạo lớp thành công!');
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(`Tạo lớp thất bại: ${error?.message || 'Lỗi không xác định'}`);
    }
  });

  const formik = useFormik<CreateClassFormValues>({
    initialValues,
    validationSchema: schema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      const payload: CreateClassPayload = { dataCreate: values };
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

  const isLoading = createMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        formik.resetForm();
      }
      onOpenChange(isOpen);
    }}>
      <DialogContent
        className="container-fixed max-w-[700px] flex flex-col p-10 overflow-hidden [&>button]:hidden">
        <DialogHeader className="p-0 border-0">
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
          <div className="flex items-center justify-between flex-wrap grow gap-5 pb-7.5">
            <div className="flex flex-col justify-center gap-2">
              <h1 className="text-xl font-semibold leading-none text-gray-900">Tạo lớp</h1>
            </div>
            <button className="btn btn-sm btn-light" onClick={() => onOpenChange(false)}>
              Close
            </button>
          </div>
        </DialogHeader>
        <DialogBody className="scrollable-y py-0 mb-5 ps-0 pe-3 -me-7">
          <form className={'grid gap-5'} onSubmit={formik.handleSubmit}>
            <div className="w-full">
              <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                <label className="form-label flex items-center gap-1 max-w-56 shrink-0">Tên lớp</label>
                <div className={'w-full'}>
                  <input
                    className={clsx('input form-control', {
                      'is-invalid': formik.touched.name && formik.errors.name
                    })}
                    type="text"
                    disabled={isLoading}
                    {...formik.getFieldProps('name')}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <span role="alert" className="text-danger text-xs mt-1">{formik.errors.name}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full">
              <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                <label className="form-label flex items-center gap-1 max-w-56 shrink-0">Mô tả</label>
                <div className="w-full">
                  <input
                    className={'input form-control'}
                    type="text"
                    disabled={isLoading}
                    {...formik.getFieldProps('description')}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-2.5">
              <button
                type={'submit'}
                className="btn btn-primary"
                disabled={isLoading || !formik.isValid || !formik.dirty}
              >
                {isLoading ? 'Đang tạo...' : 'Tạo lớp'}
              </button>
            </div>
          </form>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};

export { Create };
