import { useCallback, useMemo, useState } from 'react';
import { ColumnDef, Column } from '@tanstack/react-table';
import {
  DataGrid,
  DataGridColumnHeader,
  DataGridRowSelect,
  DataGridRowSelectAll,
  KeenIcon,
  Menu,
  MenuItem,
  MenuToggle,
} from '@/components';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/providers';
import { ISubjectData, SubjectIdentifier } from '../subjects.types';
import { EditSubject } from './EditSubject';
import { DeleteSubjectConfirmation } from './DeleteSubjectConfirmation';
import { ItemActionMenu } from '@/pages/classes/blocks/ItemActionMenu';

interface IColumnFilterProps<TData, TValue> {
  column: Column<TData, TValue>;
}

interface SubjectListProps {
  subjects: ISubjectData[];
}

export const SubjectList = ({ subjects }: SubjectListProps) => {
  const { isRTL } = useLanguage();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<ISubjectData | undefined>(undefined);
  const [deletingSubject, setDeletingSubject] = useState<SubjectIdentifier | null>(null);

  const ColumnInputFilter = useCallback(
    <TData, TValue>({ column }: IColumnFilterProps<TData, TValue>) => {
      return (
        <Input
          placeholder="Lọc..."
          value={(column.getFilterValue() as string) ?? ''}
          onChange={(event) => column.setFilterValue(event.target.value)}
          className="h-9 w-full max-w-40"
        />
      );
    },
    []
  );

  const handleEdit = useCallback((subject: ISubjectData) => {
    setEditingSubject(subject);
    setIsEditModalOpen(true);
  }, []);

  const handleOpenDeleteConfirmation = useCallback((subjectIdentifier: SubjectIdentifier) => {
    setDeletingSubject(subjectIdentifier);
    setIsDeleteModalOpen(true);
  }, []);

  const columns = useMemo<ColumnDef<ISubjectData>[]>(
    () => [
      {
        accessorKey: 'name',
        id: 'name',
        header: ({ column }) => (
          <DataGridColumnHeader title="Tên Môn học" filter={<ColumnInputFilter column={column} />} column={column} />
        ),
        cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
        enableSorting: true,
        meta: { className: 'min-w-[250px]', cellClassName: 'text-gray-800 font-normal' },
      },
      {
        id: 'actions',
        header: () => '',
        enableSorting: false,
        cell: ({ row }) => (
          <Menu className="items-stretch">
            <MenuItem
              toggle="dropdown"
              trigger="click"
              dropdownProps={{
                placement: isRTL?.() ? 'bottom-start' : 'bottom-end',
                modifiers: [{ name: 'offset', options: { offset: [0, 10] } }],
              }}
            >
              <MenuToggle className="btn btn-sm btn-icon btn-light btn-clear">
                <KeenIcon icon="dots-vertical" />
              </MenuToggle>
              {ItemActionMenu({
                isEdit: true,
                handleEdit: () => handleEdit(row.original),
                isDeleteConfirmation: true,
                handleDeleteConfirmation: () =>
                  handleOpenDeleteConfirmation({ id: row.original.id, name: row.original.name }),
              })}
            </MenuItem>
          </Menu>
        ),
        meta: { headerClassName: 'w-[60px] text-end', cellClassName: 'text-end' },
      },
    ],
    [isRTL, ColumnInputFilter, handleEdit, handleOpenDeleteConfirmation]
  );

  return (
    <>
      <DataGrid
        columns={columns}
        data={subjects}
        pagination={{ size: 10 }}
        sorting={[{ id: 'name', desc: false }]}
        layout={{ card: true }}
      />
      <EditSubject
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        editingSubject={editingSubject}
        onClose={() => setEditingSubject(undefined)}
      />
      <DeleteSubjectConfirmation
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        subjectToDelete={deletingSubject}
        onClose={() => setDeletingSubject(null)}
      />
    </>
  );
};
