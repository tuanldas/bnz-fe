import { KeenIcon, MenuIcon, MenuItem, MenuLink, MenuSub, MenuTitle } from '@/components';

type PropsType = {
  isViewDetails?: boolean;
  handleViewDetails?: () => void;
  isEdit?: boolean;
  handleEdit?: () => void;
  isDeleteConfirmation?: boolean;
  handleDeleteConfirmation?: () => void;
  isAssignSubject?: boolean;
  handleAssignSubject?: () => void;
};

const ItemActionMenu = ({
                          isViewDetails,
                          handleViewDetails,
                          isEdit,
                          handleEdit,
                          isDeleteConfirmation,
                          handleDeleteConfirmation,
                          isAssignSubject,
                          handleAssignSubject,
                        }: PropsType) => {
  return (
    <MenuSub className="menu-default" rootClassName="w-full max-w-[200px]">
      {isViewDetails && handleViewDetails && (
        <MenuItem onClick={handleViewDetails}>
          <MenuLink>
            <MenuIcon>
              <KeenIcon icon="eye" />
            </MenuIcon>
            <MenuTitle>Xem chi tiết</MenuTitle>
          </MenuLink>
        </MenuItem>
      )}
      {isEdit && handleEdit && (
        <MenuItem onClick={handleEdit}>
          <MenuLink>
            <MenuIcon>
              <KeenIcon icon="notepad-edit" />
            </MenuIcon>
            <MenuTitle>Sửa</MenuTitle>
          </MenuLink>
        </MenuItem>
      )}
      {isAssignSubject && handleAssignSubject && (
        <MenuItem onClick={handleAssignSubject}>
          <MenuLink>
            <MenuIcon>
              <KeenIcon icon="book" />
            </MenuIcon>
            <MenuTitle>Thêm môn học</MenuTitle>
          </MenuLink>
        </MenuItem>
      )}
      {isDeleteConfirmation && handleDeleteConfirmation && (
        <MenuItem onClick={handleDeleteConfirmation}>
          <MenuLink>
            <MenuIcon>
              <KeenIcon icon="tablet-delete" />
            </MenuIcon>
            <MenuTitle>Xóa</MenuTitle>
          </MenuLink>
        </MenuItem>
      )}
    </MenuSub>
  );
};

export { ItemActionMenu };
