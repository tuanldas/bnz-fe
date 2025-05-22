import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { callApiDeleteStudent } from '@/api/student.tsx';
import { toast } from 'sonner';
import { StudentIdentifier } from '@/pages/students/students.tsx';

interface DeleteStudentProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  studentToDelete: StudentIdentifier | null | undefined;
}

const DeleteStudentConfirmation = ({ open, onOpenChange, studentToDelete }: DeleteStudentProps) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (studentId: number) => callApiDeleteStudent({ studentId: studentId }),
    onSuccess: (data, studentId) => {
      toast.success(`Đã xóa học sinh thành công (ID: ${studentId})`);
      queryClient.invalidateQueries({ queryKey: ['students'] });
      onOpenChange(false);
    },
    onError: (error: any, studentId) => {
      toast.error(`Xóa học sinh thất bại (ID: ${studentId}): ${error?.message || 'Lỗi không xác định'}`);
    }
  });

  const handleDeleteConfirm = () => {
    if (studentToDelete?.id !== undefined) {
      deleteMutation.mutate(Number(studentToDelete.id));
    } else {
      toast.error('Không thể xóa: Thiếu ID học sinh.');
      onOpenChange(false);
    }
  };

  const { isPending } = deleteMutation;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader className="flex flex-col space-y-1.5 text-left">
          <DialogTitle>Xác nhận xóa học sinh</DialogTitle>
          <DialogDescription>
            {studentToDelete
              ? `Bạn có chắc chắn muốn xóa học sinh "${studentToDelete.fullName}" (ID: ${studentToDelete.id}) không? Hành động này không thể hoàn tác.`
              : 'Bạn có chắc chắn muốn xóa học sinh này không? Hành động này không thể hoàn tác.'
            }
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-4 sm:justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline" disabled={isPending}>Hủy bỏ</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleDeleteConfirm}
            disabled={isPending || !studentToDelete}
          >
            {isPending ? 'Đang xóa...' : 'Xác nhận Xóa'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { DeleteStudentConfirmation };
