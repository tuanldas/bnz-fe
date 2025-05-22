import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { callApiDeleteClass } from '@/api/class.tsx';
import { toast } from 'sonner';
import { IUsersData } from '@/pages/classes/blocks/List.tsx';

interface DeleteProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  classToDelete: Pick<IUsersData, 'id' | 'name'> | null | undefined;
}

const DeleteConfirmation = ({ open, onOpenChange, classToDelete }: DeleteProps) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (classId: number) => callApiDeleteClass({ classId: classId }),
    onSuccess: (data, classId) => {
      toast.success(`Đã xóa lớp thành công (ID: ${classId})`);
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      onOpenChange(false);
    },
    onError: (error: any, classId) => {
      toast.error(`Xóa lớp thất bại (ID: ${classId}): ${error?.message || 'Lỗi không xác định'}`);
    }
  });

  const handleDeleteConfirm = () => {
    if (classToDelete?.id !== undefined) {
      deleteMutation.mutate(classToDelete.id);
    } else {
      toast.error('Không thể xóa: Không xác định được ID lớp.');
      onOpenChange(false);
    }
  };

  // Sử dụng isPending cho React Query v5
  const { isPending } = deleteMutation;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-6">
        <DialogHeader className="text-left">
          <DialogTitle>Xác nhận xóa lớp</DialogTitle>
        </DialogHeader>

        <DialogBody className="py-4">
          <p className="text-sm text-muted-foreground">
            {classToDelete ? (
              <>
                Bạn có chắc chắn muốn xóa lớp "
                <strong>{classToDelete.name}</strong>
                {`" (ID: ${classToDelete.id}) không? Hành động này không thể hoàn tác.`}
              </>
            ) : (
              'Bạn có chắc chắn muốn xóa lớp này không? Hành động này không thể hoàn tác.'
            )}
          </p>
        </DialogBody>


        <DialogFooter className="pt-5">
          <DialogClose asChild>
            <Button variant="outline" disabled={isPending}>Hủy bỏ</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleDeleteConfirm}
            disabled={isPending || !classToDelete}
          >
            {isPending ? 'Đang xóa...' : 'Xác nhận Xóa'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { DeleteConfirmation };
