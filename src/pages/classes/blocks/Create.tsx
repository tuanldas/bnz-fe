import {Dialog, DialogBody, DialogContent, DialogDescription, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import clsx from 'clsx';
import {useState} from 'react';
import {callApiCreateClass} from '@/api/class.tsx';
import {toast} from 'sonner';


const schema = Yup.object().shape({
    name: Yup.string()
        .min(3, 'Tên lớp tối thiểu 3 ký tự')
        .max(50, 'Tên lớp tối đa 50 ký tự')
        .required('Tên lớp là bắt buộc'),
});

const initialValues = {
    name: '',
    description: '',
};

const Create = ({onOpenChange, open}: {
    open: boolean;
    onOpenChange: () => void;
}) => {
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues,
        validationSchema: schema,
        onSubmit: async (values, {setStatus, setSubmitting}) => {
            setLoading(true);

            try {
                await callApiCreateClass({dataCreate: values});
                onOpenChange();
                toast.success('Tạo lớp thành công', {
                    position: 'top-right'
                });
            } catch {
                setStatus('Tạo lớp thất bại');
                setSubmitting(false);
            }
            setLoading(false);
        }
    });


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="container-fixed max-w-[700px] flex flex-col p-10 overflow-hidden [&>button]:hidden">
                <DialogHeader className="p-0 border-0">
                    <DialogTitle></DialogTitle>
                    <DialogDescription></DialogDescription>
                    <div className="flex items-center justify-between flex-wrap grow gap-5 pb-7.5">
                        <div className="flex flex-col justify-center gap-2">
                            <h1 className="text-xl font-semibold leading-none text-gray-900">Tạo lớp</h1>
                        </div>
                        <button className="btn btn-sm btn-light" onClick={onOpenChange}>
                            Close
                        </button>
                    </div>
                </DialogHeader>
                <DialogBody className="scrollable-y py-0 mb-5 ps-0 pe-3 -me-7">
                    <form className={'grid gap-5'}
                          onSubmit={formik.handleSubmit}
                    >
                        <div className="w-full">
                            <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                                <label className="form-label flex items-center gap-1 max-w-56">Tên lớp</label>
                                <div className={'w-full'}>
                                    <input
                                        className={clsx('input form-control', {
                                            'is-invalid': formik.touched.name && formik.errors.name
                                        })}
                                        type="text"
                                        {...formik.getFieldProps('name')}
                                    />
                                    {formik.touched.name && formik.errors.name && (
                                        <span role="alert"
                                              className="text-danger text-xs mt-1">{formik.errors.name}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="w-full">
                            <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                                <label className="form-label flex items-center gap-1 max-w-56">Mô tả</label>
                                <input
                                    className={'input'}
                                    type="text"
                                    {...formik.getFieldProps('description')}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-2.5">
                            <button type={'submit'}
                                    className="btn btn-primary"
                                    disabled={loading || formik.isSubmitting}
                            >Save Changes
                            </button>
                        </div>
                    </form>
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
};

export {Create};
