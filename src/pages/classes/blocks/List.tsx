import {
  DataGrid,
  DataGridColumnHeader,
  DataGridRowSelect,
  DataGridRowSelectAll,
  KeenIcon,
  Menu,
  MenuItem,
  MenuToggle
} from '@/components';
import { useCallback, useMemo, useState } from 'react';
import { Column, ColumnDef } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/providers';
import { ItemActionMenu } from '@/pages/classes/blocks/ItemActionMenu.tsx';
import { Edit } from '@/pages/classes/blocks/Edit.tsx';
import { DeleteConfirmation } from '@/pages/classes/blocks/Delete.tsx';
import { Details } from '@/pages/classes/blocks/Details.tsx';

interface IColumnFilterProps<TData, TValue> {
  column: Column<TData, TValue>;
}

export class IUsersData {
  id: number | undefined;
  name: string | undefined;
  description: string | undefined;
}

const List = ({ classes }: { classes: any }) => {
  const { isRTL } = useLanguage();
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [isModalDeleteConfirmationOpen, setIsModalDeleteConfirmationOpen] = useState(false);
  const [isModalDetailsOpen, setIsModalDetailsOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<IUsersData | undefined>(undefined);
  const [viewingClass, setViewingClass] = useState<IUsersData | undefined>(undefined); // State cho lớp đang xem chi tiết

  const ColumnInputFilter = <TData, TValue>({ column }: IColumnFilterProps<TData, TValue>) => {
    return (
      <Input
        placeholder="Filter..."
        value={(column.getFilterValue() as string) ?? ''}
        onChange={(event) => column.setFilterValue(event.target.value)}
        className="h-9 w-full max-w-40"
      />
    );
  };

  const handleEdit = (rowId: IUsersData) => {
    setEditingClass(rowId);
    onEdit();
  };

  const handleDeleteConfirmation = (rowId: IUsersData) => {
    setEditingClass(rowId);
    onDeleteConfirmation();
  };

  const onEdit = () => {
    return setIsModalEditOpen(!isModalEditOpen);
  };

  const onDeleteConfirmation = () => {
    return setIsModalDeleteConfirmationOpen(!isModalDeleteConfirmationOpen);
  };
  const onDetailsModalToggle = () => {
    return setIsModalDetailsOpen(!isModalDetailsOpen);
  };
  const handleViewDetails = useCallback((classData: IUsersData) => {
    setViewingClass(classData);
    onDetailsModalToggle();
  }, [onDetailsModalToggle]);
  const columns = useMemo<ColumnDef<IUsersData>[]>(
    () => [
      {
        accessorKey: 'id',
        header: () => <DataGridRowSelectAll />,
        cell: ({ row }) => <DataGridRowSelect row={row} />,
        enableSorting: false,
        enableHiding: false,
        meta: {
          headerClassName: 'w-0'
        }
      },
      {
        accessorFn: (row: IUsersData) => row.name,
        id: 'name',
        header: ({ column }) => <DataGridColumnHeader title="Lớp" filter={<ColumnInputFilter column={column} />}
                                                      column={column} />,
        enableSorting: true,
        meta: {
          className: 'min-w-[300px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row) => row.description,
        id: 'description',
        header: ({ column }) => <DataGridColumnHeader title="Mô tả" column={column} />,
        enableSorting: true,
        cell: (info) => {
          return info.row.original.description;
        },
        meta: {
          headerClassName: 'min-w-[180px]'
        }
      },
      {
        id: 'click',
        header: () => '',
        enableSorting: false,
        cell: ({ row }) => (
          <Menu className="items-stretch">
            <MenuItem
              toggle="dropdown"
              trigger="click"
              dropdownProps={{
                placement: isRTL() ? 'bottom-start' : 'bottom-end',
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: isRTL() ? [0, -10] : [0, 10] // [skid, distance]
                    }
                  }
                ]
              }}
            >
              <MenuToggle className="btn btn-sm btn-icon btn-light btn-clear">
                <KeenIcon icon="dots-vertical" />
              </MenuToggle>
              {ItemActionMenu({
                isEdit: true,
                handleEdit: () => handleEdit(row.original),
                isDeleteConfirmation: true,
                handleDeleteConfirmation: () => handleDeleteConfirmation(row.original),
                isViewDetails: true,
                handleViewDetails: () => handleViewDetails(row.original)
              })}
            </MenuItem>
          </Menu>
        ),
        meta: {
          headerClassName: 'w-[60px]'
        }
      }
    ],
    []
  );

  return (
    <>
      <DataGrid
        columns={columns}
        data={classes}
        rowSelection={true}
        pagination={{ size: 10 }}
        sorting={[{ id: 'name', desc: false }]}
        layout={{ card: true }}
      />
      <Edit open={isModalEditOpen}
            onOpenChange={onEdit}
            editingClass={editingClass}
      />
      <DeleteConfirmation open={isModalDeleteConfirmationOpen}
                          onOpenChange={onDeleteConfirmation}
                          classToDelete={editingClass}
      />
      <Details
        open={isModalDetailsOpen}
        onOpenChange={onDetailsModalToggle}
        classData={viewingClass}
      />
    </>
  );
};

export { List };
