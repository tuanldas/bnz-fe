import { KeenIcon, MenuIcon, MenuItem, MenuLink, MenuSub, MenuTitle } from '@/components';

type PropsType = {
  isEdit: boolean,
  handleEdit: () => void,
  isDeleteConfirmation: boolean,
  handleDeleteConfirmation: () => void
  isViewDetails: boolean,
  handleViewDetails: () => void
}

const ItemActionMenu = ({
                          isEdit,
                          handleEdit,
                          isDeleteConfirmation,
                          handleDeleteConfirmation,
                          isViewDetails,
                          handleViewDetails
                        }: PropsType) => {
  return (
    <MenuSub className="menu-default" rootClassName="w-full max-w-[200px]">
      {isViewDetails && handleViewDetails && (
        <MenuItem onClick={handleViewDetails}>
          <MenuLink>
            <MenuIcon>
              {/* Chọn một icon phù hợp, ví dụ: 'eye', 'file-magnifying-glass', 'information-outline' */}
              <KeenIcon icon="eye" />
            </MenuIcon>
            <MenuTitle>Xem chi tiết</MenuTitle>
          </MenuLink>
        </MenuItem>
      )}
      {
        isEdit
          ? <MenuItem onClick={() => handleEdit()}>
            <MenuLink>
              <MenuIcon>
                <KeenIcon icon="notepad-edit" />
              </MenuIcon>
              <MenuTitle>Sửa</MenuTitle>
            </MenuLink>
          </MenuItem>
          : null
      }
      {
        isDeleteConfirmation
          ? <MenuItem onClick={() => handleDeleteConfirmation()}>
            <MenuLink>
              <MenuIcon>
                <KeenIcon icon="tablet-delete" />
              </MenuIcon>
              <MenuTitle>Xóa</MenuTitle>
            </MenuLink>
          </MenuItem>
          : null
      }
    </MenuSub>
  );
};

export { ItemActionMenu };
