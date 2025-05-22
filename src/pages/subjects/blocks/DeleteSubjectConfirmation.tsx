import {
  Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { SubjectIdentifier } from '../subjects.types';
import { callApiDeleteSubject } from '@/api/subject';

interface DeleteSubjectProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  subjectToDelete: SubjectIdentifier | null | undefined;
  onClose?: () => void;
}

export const DeleteSubjectConfirmation = ({ open, onOpenChange, subjectToDelete, onClose }: DeleteSubjectProps) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (subjectId: number) => callApiDeleteSubject({ subjectId }),
    onSuccess: (_data, subjectId) => {
      toast.success(`Đã xóa môn học thành công (ID: ${subjectId})`);
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      onOpenChange(false);
    },
    onError: (error: any, subjectId) => {
      toast.error(`Xóa môn học thất bại (ID: ${subjectId}): ${error?.message || 'Lỗi không xác định'}`);
    },
  });

  const handleDeleteConfirm = () => {
    if (subjectToDelete?.id !== undefined) {
      deleteMutation.mutate(subjectToDelete.id);
    } else {
      toast.error('Không thể xóa: Thiếu ID môn học.');
      onOpenChange(false);
    }
  };

  const handleOpenChangeWithReset = (isOpen: boolean) => {
    if (!isOpen) {
      if (onClose) onClose();
    }
    onOpenChange(isOpen);
  };

  const { isPending } = deleteMutation;

  return (
    <Dialog open={open} onOpenChange={handleOpenChangeWithReset}>
      <DialogContent className="sm:max-w-md p-6">
        <DialogHeader className="flex flex-col space-y-1.5 text-left">
          <DialogTitle>Xác nhận xóa môn học</DialogTitle>
          <DialogDescription>
            {subjectToDelete
              ? `Bạn có chắc chắn muốn xóa môn học "${subjectToDelete.name}" (ID: ${subjectToDelete.id}) không? Hành động này không thể hoàn tác.`
              : 'Bạn có chắc chắn muốn xóa môn học này không? Hành động này không thể hoàn tác.'}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-4 sm:justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline" disabled={isPending} onClick={() => handleOpenChangeWithReset(false)}>
              Hủy bỏ
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleDeleteConfirm}
            disabled={isPending || !subjectToDelete}
          >
            {isPending ? 'Đang xóa...' : 'Xác nhận Xóa'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
