// src/pages/classes/blocks/Details.tsx
import {
  Dialog,
  DialogBody,
  DialogContent,
  // DialogDescription, // Bạn có thể bỏ qua nếu không dùng
  DialogHeader
  // DialogTitle // Tiêu đề sẽ đặt trong h1 tương tự Edit.tsx
} from '@/components/ui/dialog'; // Đảm bảo đường dẫn import Dialog là chính xác
import { IUsersData } from '@/pages/classes/blocks/List.tsx'; // Import interface/class IUsersData

interface IDetailsProps {
  open: boolean;
  onOpenChange: () => void;
  classData?: IUsersData; // Dữ liệu lớp để hiển thị
}

const Details = ({ open, onOpenChange, classData }: IDetailsProps) => {
  // Dialog sẽ tự xử lý việc hiển thị dựa trên prop 'open'.
  // Nếu 'open' là true nhưng classData chưa có, ta sẽ hiển thị thông báo tải bên trong Dialog.

  const displayTitle = classData?.name
    ? `Chi tiết lớp học: ${classData.name}`
    : "Chi tiết lớp học";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="container-fixed max-w-[700px] flex flex-col p-10 overflow-hidden [&>button]:hidden">
        <DialogHeader className="p-0 border-0">
          {/* DialogTitle và DialogDescription có thể để trống nếu bạn đặt tiêu đề như bên dưới */}
          {/* <DialogTitle></DialogTitle> */}
          {/* <DialogDescription></DialogDescription> */}
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
              {/* Mục 1: ID Lớp */}
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

              {/* Mục 2: Tên lớp */}
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

              {/* Mục 3: Mô tả */}
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

              {/* Bổ sung thêm các trường thông tin khác của lớp nếu cần, theo cấu trúc tương tự */}
              {/* Ví dụ:
              <div className="w-full">
                <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2.5">
                  <label className="form-label shrink-0 basis-full sm:basis-1/4 font-medium text-gray-500">
                    Số lượng học viên:
                  </label>
                  <div className="w-full sm:basis-3/4">
                    <p className="text-sm text-gray-800 break-words">
                      {classData.studentCount ?? 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
              */}
            </div>
          )}
        </DialogBody>
        {/* Không cần DialogFooter nếu nút đóng đã có trong DialogHeader */}
      </DialogContent>
    </Dialog>
  );
};

export { Details };
