import { KeenIcon, MenuIcon, MenuItem, MenuLink, MenuSub, MenuTitle } from '@/components';

type PropsType = {
  isEdit: boolean,
  handleEdit: () => void,
  isDeleteConfirmation: boolean,
  handleDeleteConfirmation: () => void
}

const ItemActionMenu = ({
                          isEdit,
                          handleEdit,
                          isDeleteConfirmation,
                          handleDeleteConfirmation
                        }: PropsType) => {
  return (
    <MenuSub className="menu-default" rootClassName="w-full max-w-[200px]">
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
