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
import { callApiDeleteTeacher } from '@/api/teacher.tsx';
import { toast } from 'sonner';
import { TeacherIdentifier } from '@/pages/teachers/teachers.tsx';

interface DeleteTeacherProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  teacherToDelete: TeacherIdentifier | null | undefined;
}

const DeleteTeacherConfirmation = ({ open, onOpenChange, teacherToDelete }: DeleteTeacherProps) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (teacherId: number) => callApiDeleteTeacher({ teacherId: teacherId }),
    onSuccess: (data, teacherId) => {
      toast.success(`Đã xóa giảng viên thành công (ID: ${teacherId})`);
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      onOpenChange(false);
    },
    onError: (error: any, teacherId) => {
      toast.error(`Xóa giảng viên thất bại (ID: ${teacherId}): ${error?.message || 'Lỗi không xác định'}`);
    }
  });

  const handleDeleteConfirm = () => {
    if (teacherToDelete?.id !== undefined) {
      deleteMutation.mutate(Number(teacherToDelete.id));
    } else {
      toast.error('Không thể xóa: Thiếu ID giảng viên.');
      onOpenChange(false);
    }
  };

  const { isPending } = deleteMutation;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader className="flex flex-col space-y-1.5 text-left">
          <DialogTitle>Xác nhận xóa giảng viên</DialogTitle>
          <DialogDescription>
            {teacherToDelete
              ? `Bạn có chắc chắn muốn xóa giảng viên "${teacherToDelete.fullName}" (ID: ${teacherToDelete.id}) không? Hành động này không thể hoàn tác.`
              : 'Bạn có chắc chắn muốn xóa giảng viên này không? Hành động này không thể hoàn tác.'
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
            disabled={isPending || !teacherToDelete}
          >
            {isPending ? 'Đang xóa...' : 'Xác nhận Xóa'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { DeleteTeacherConfirmation };
