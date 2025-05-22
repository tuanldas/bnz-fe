// src/pages/classes/blocks/Details.tsx
import { Dialog, DialogBody, DialogContent, DialogHeader } from '@/components/ui/dialog'; // Đảm bảo đường dẫn import Dialog là chính xác
import { IUsersData } from '@/pages/classes/blocks/List.tsx'; // Import interface/class IUsersData

interface IDetailsProps {
  open: boolean;
  onOpenChange: () => void;
  classData?: IUsersData;
}

const Details = ({ open, onOpenChange, classData }: IDetailsProps) => {

  const displayTitle = classData?.name
    ? `Chi tiết lớp học: ${classData.name}`
    : 'Chi tiết lớp học';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="container-fixed max-w-[700px] flex flex-col p-10 overflow-hidden [&>button]:hidden">
        <DialogHeader className="p-0 border-0">
          <div className="flex items-center justify-between flex-wrap grow gap-5 pb-7.5">
            <div className="flex flex-col justify-center gap-2">
              <h1 className="text-xl font-semibold leading-none text-gray-900">
                {displayTitle}
              </h1>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-light"
              onClick={onOpenChange}
            >
              Đóng
            </button>
          </div>
        </DialogHeader>
        <DialogBody className="scrollable-y py-0 mb-5 ps-0 pe-3 -me-7">
          {!classData ? (
            <p className="text-gray-600 text-center py-4">Đang tải thông tin lớp hoặc không tìm thấy dữ liệu...</p>
          ) : (
            <div className="space-y-5 py-2">
              <div className="w-full">
                <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2.5">
                  <label className="form-label shrink-0 basis-full sm:basis-1/4 font-medium text-gray-500">
                    ID Lớp:
                  </label>
                  <div className="w-full sm:basis-3/4">
                    <p className="text-sm text-gray-800 break-words">
                      {classData.id ?? 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full">
                <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2.5">
                  <label className="form-label shrink-0 basis-full sm:basis-1/4 font-medium text-gray-500">
                    Tên lớp:
                  </label>
                  <div className="w-full sm:basis-3/4">
                    <p className="text-sm text-gray-800 break-words">
                      {classData.name ?? 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full">
                <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2.5">
                  <label className="form-label shrink-0 basis-full sm:basis-1/4 font-medium text-gray-500">
                    Mô tả:
                  </label>
                  <div className="w-full sm:basis-3/4">
                    <p className="text-sm text-gray-800 break-words">
                      {classData.description || <span className="italic text-gray-400">Không có mô tả</span>}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};

export { Details };
