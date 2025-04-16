import { KeenIcon, MenuIcon, MenuItem, MenuLink, MenuSub, MenuTitle } from '@/components';

const ItemActionMenu = ({ isEdit, handleEdit }: { isEdit: boolean, handleEdit: () => void }) => {
  return (
    <MenuSub className="menu-default" rootClassName="w-full max-w-[200px]">
      {
        isEdit
          ? <MenuItem onClick={() => handleEdit()}>
            <MenuLink>
              <MenuIcon>
                <KeenIcon icon="setting-3" />
              </MenuIcon>
              <MenuTitle>Settings</MenuTitle>
            </MenuLink>
          </MenuItem>
          : null
      }
    </MenuSub>
  );
};

export { ItemActionMenu };
