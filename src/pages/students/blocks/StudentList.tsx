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
import { EditStudent } from './EditStudent';
import { DeleteStudentConfirmation } from './DeleteStudentConfirmation';
import { IStudentData, StudentIdentifier } from '@/pages/students/students.tsx';

interface IColumnFilterProps<TData, TValue> {
  column: Column<TData, TValue>;
}

const StudentList = ({ students }: { students: IStudentData[] | undefined }) => {
  const { isRTL } = useLanguage();
  const [isModalEditStudentOpen, setIsModalEditStudentOpen] = useState(false);
  const [isModalDeleteStudentConfirmationOpen, setIsModalDeleteStudentConfirmationOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<IStudentData | undefined>(undefined);
  const [studentIdentifierToDelete, setStudentIdentifierToDelete] = useState<StudentIdentifier | null>(null);

  const ColumnInputFilter = useCallback(<TData, TValue>({ column }: IColumnFilterProps<TData, TValue>) => {
    return (<Input placeholder="Filter..." value={(column.getFilterValue() as string) ?? ''}
                   onChange={(event) => column.setFilterValue(event.target.value)} className="h-9 w-full max-w-40" />);
  }, []);


  const handleEditStudent = useCallback((studentData: IStudentData) => {
    setEditingStudent(studentData);
    setIsModalEditStudentOpen(true);
  }, []);

  const handleOpenDeleteStudentConfirmation = useCallback((studentIdentifier: StudentIdentifier) => {
    setStudentIdentifierToDelete(studentIdentifier);
    setIsModalDeleteStudentConfirmationOpen(true);
  }, []);

  const handleCloseEditStudent = useCallback((isOpen: boolean) => {
    setIsModalEditStudentOpen(isOpen);
    if (!isOpen) {
      setEditingStudent(undefined);
    }
  }, []);

  const handleCloseDeleteStudentConfirmation = useCallback((isOpen: boolean) => {
    setIsModalDeleteStudentConfirmationOpen(isOpen);
    if (!isOpen) {
      setStudentIdentifierToDelete(null);
    }
  }, []);


  const columns = useMemo<ColumnDef<IStudentData>[]>(
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
        accessorFn: (row) => row.classId,
        id: 'classId',
        header: ({ column }) => <DataGridColumnHeader title="ID Lớp" column={column} />,
        enableSorting: true,
        meta: { headerClassName: 'min-w-[100px]' }
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
                handleEdit: () => handleEditStudent(row.original),
                isDeleteConfirmation: true,
                handleDeleteConfirmation: () => handleOpenDeleteStudentConfirmation({
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
    [isRTL, ColumnInputFilter, handleEditStudent, handleOpenDeleteStudentConfirmation]
  );

  return (
    <>
      <DataGrid
        columns={columns}
        data={students ?? []}
        rowSelection={true}
        pagination={{ size: 10 }}
        sorting={[{ id: 'fullName', desc: false }]}
        layout={{ card: true }}
      />
      <EditStudent
        open={isModalEditStudentOpen}
        onOpenChange={handleCloseEditStudent}
        editingStudent={editingStudent}
      />
      <DeleteStudentConfirmation
        open={isModalDeleteStudentConfirmationOpen}
        onOpenChange={handleCloseDeleteStudentConfirmation}
        studentToDelete={studentIdentifierToDelete}
      />
    </>
  );
};

export { StudentList };
