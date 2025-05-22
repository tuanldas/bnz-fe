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
import { EditTeacher } from './EditTeacher.tsx';
import { DeleteTeacherConfirmation } from './DeleteTeacherConfirmation.tsx';
import { ITeacherData, TeacherIdentifier } from '../teachers.tsx';

interface IColumnFilterProps<TData, TValue> {
  column: Column<TData, TValue>;
}

const TeacherList = ({ teachers }: { teachers: ITeacherData[] | undefined }) => {
  const { isRTL } = useLanguage();
  const [isModalEditTeacherOpen, setIsModalEditTeacherOpen] = useState(false);
  const [isModalDeleteTeacherConfirmationOpen, setIsModalDeleteTeacherConfirmationOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<ITeacherData | undefined>(undefined);
  const [teacherIdentifierToDelete, setTeacherIdentifierToDelete] = useState<TeacherIdentifier | null>(null);

  const ColumnInputFilter = useCallback(<TData, TValue>({ column }: IColumnFilterProps<TData, TValue>) => {
    return (<Input placeholder="Filter..." value={(column.getFilterValue() as string) ?? ''}
                   onChange={(event) => column.setFilterValue(event.target.value)} className="h-9 w-full max-w-40" />);
  }, []);


  const handleEditTeacher = useCallback((teacherData: ITeacherData) => {
    setEditingTeacher(teacherData);
    setIsModalEditTeacherOpen(true);
  }, []);

  const handleOpenDeleteTeacherConfirmation = useCallback((teacherIdentifier: { id: number; fullName: string }) => {
    setTeacherIdentifierToDelete(teacherIdentifier);
    setIsModalDeleteTeacherConfirmationOpen(true);
  }, []);

  const handleCloseEditTeacher = useCallback((isOpen: boolean) => {
    setIsModalEditTeacherOpen(isOpen);
    if (!isOpen) {
      setEditingTeacher(undefined);
    }
  }, []);

  const handleCloseDeleteTeacherConfirmation = useCallback((isOpen: boolean) => {
    setIsModalDeleteTeacherConfirmationOpen(isOpen);
    if (!isOpen) {
      setTeacherIdentifierToDelete(null);
    }
  }, []);


  const columns = useMemo<ColumnDef<ITeacherData>[]>(
    () => [
      {
        id: 'select',
        header: () => <DataGridRowSelectAll />,
        cell: ({ row }) => <DataGridRowSelect row={row} />,
        enableSorting: false, enableHiding: false, meta: { headerClassName: 'w-0' }
      },
      {
        accessorFn: (row) => row.fullName,
        id: 'fullName',
        header: ({ column }) => <DataGridColumnHeader title="Họ và Tên" filter={<ColumnInputFilter column={column} />}
                                                      column={column} />,
        enableSorting: true,
        meta: { className: 'min-w-[250px]', cellClassName: 'text-gray-800 font-normal' }
      },
      {
        accessorFn: (row) => row.email,
        id: 'email',
        header: ({ column }) => <DataGridColumnHeader title="Email" filter={<ColumnInputFilter column={column} />}
                                                      column={column} />,
        enableSorting: true,
        meta: { className: 'min-w-[250px]' }
      },
      {
        accessorFn: (row) => row.dateOfBirth,
        id: 'dateOfBirth',
        header: ({ column }) => <DataGridColumnHeader title="Ngày Sinh" column={column} />,
        enableSorting: true,
        cell: (info) => {
          try {
            return new Date(info.getValue() as string).toLocaleDateString('vi-VN');
          } catch (e) {
            return info.getValue();
          }
        },
        meta: { headerClassName: 'min-w-[120px]' }
      },
      {
        accessorFn: (row) => row.phone,
        id: 'phone',
        header: ({ column }) => <DataGridColumnHeader title="Điện thoại" column={column} />,
        enableSorting: false,
        meta: { headerClassName: 'min-w-[120px]' }
      },
      {
        id: 'actions',
        header: () => '', enableSorting: false,
        cell: ({ row }) => (
          <Menu className="items-stretch">
            <MenuItem
              toggle="dropdown"
              trigger="click"
              dropdownProps={{
                placement: isRTL() ? 'bottom-start' : 'bottom-end',
                modifiers: [{ name: 'offset', options: { offset: [0, 10] } }]
              }}
            >
              <MenuToggle className="btn btn-sm btn-icon btn-light btn-clear"><KeenIcon
                icon="dots-vertical" /></MenuToggle>
              {ItemActionMenu({
                isEdit: true,
                handleEdit: () => handleEditTeacher(row.original),
                isDeleteConfirmation: true,
                handleDeleteConfirmation: () => handleOpenDeleteTeacherConfirmation({
                  id: row.original.id,
                  fullName: row.original.fullName
                })
              })}
            </MenuItem>
          </Menu>
        ),
        meta: { headerClassName: 'w-[60px]' }
      }
    ],
    [isRTL, ColumnInputFilter, handleEditTeacher, handleOpenDeleteTeacherConfirmation]
  );

  return (
    <>
      <DataGrid
        columns={columns}
        data={teachers ?? []}
        rowSelection={true}
        pagination={{ size: 10 }}
        sorting={[{ id: 'fullName', desc: false }]}
        layout={{ card: true }}
      />
      <EditTeacher
        open={isModalEditTeacherOpen}
        onOpenChange={handleCloseEditTeacher}
        editingTeacher={editingTeacher}
      />
      <DeleteTeacherConfirmation
        open={isModalDeleteTeacherConfirmationOpen}
        onOpenChange={handleCloseDeleteTeacherConfirmation}
        teacherToDelete={teacherIdentifierToDelete}
      />
    </>
  );
};

export { TeacherList };
