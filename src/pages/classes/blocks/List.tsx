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
import { ColumnDef, Row } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/providers';
import { useQuery } from '@tanstack/react-query';
import { ItemActionMenu } from '@/pages/classes/blocks/ItemActionMenu.tsx';
import { Edit } from '@/pages/classes/blocks/Edit.tsx';
import { DeleteConfirmation } from '@/pages/classes/blocks/Delete.tsx';
import { Details } from '@/pages/classes/blocks/Details.tsx';
import { AssignSubjectDialog } from '@/pages/classes/blocks/AssignSubjectDialog.tsx';
import { callApiGetSubjects } from '@/api/subject';
import { callApiGetTeachers } from '@/api/teacher';

export interface ISubjectData {
  id: number;
  name: string;
}

export interface ITeacherData {
  id: number;
  fullName: string;
}

interface ApiSubjectsResponse {
  data: {
    data: ISubjectData[];
  };
}

interface ApiTeachersResponse {
  data: {
    data: ITeacherData[];
  };
}

export class IUsersData {
  id: number | undefined;
  name: string | undefined;
  description: string | undefined;
}

const List = ({ classes }: { classes: IUsersData[] | undefined }) => {
  const { isRTL } = useLanguage();
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [isModalDeleteConfirmationOpen, setIsModalDeleteConfirmationOpen] = useState(false);
  const [isModalDetailsOpen, setIsModalDetailsOpen] = useState(false);
  const [isAssignSubjectDialogOpen, setIsAssignSubjectDialogOpen] = useState(false);

  const [editingClass, setEditingClass] = useState<IUsersData | undefined>(undefined);
  const [viewingClass, setViewingClass] = useState<IUsersData | undefined>(undefined);
  const [classToAssignSubject, setClassToAssignSubject] = useState<IUsersData | undefined>(undefined);

  const { data: teachersApiResponse, isLoading: isLoadingTeachers } = useQuery<ApiTeachersResponse, Error>({
    queryKey: ['teachers'],
    queryFn: callApiGetTeachers
  });
  const teachersList: ITeacherData[] | undefined = teachersApiResponse?.data?.data;

  const { data: subjectsList, isLoading: isLoadingSubjects } = useQuery<ApiSubjectsResponse, Error, ISubjectData[]>({
      queryKey: ['subjects'],
      queryFn: callApiGetSubjects,
      select: (response) => response.data.data
    }
  );

  const onEditModalToggle = useCallback(() => setIsModalEditOpen(prev => !prev), []);
  const onDeleteConfirmationModalToggle = useCallback(() => setIsModalDeleteConfirmationOpen(prev => !prev), []);
  const onDetailsModalToggle = useCallback(() => setIsModalDetailsOpen(prev => !prev), []);
  const onAssignSubjectDialogToggle = useCallback(() => {
    setIsAssignSubjectDialogOpen(prev => !prev);
    if (isAssignSubjectDialogOpen) {
      setClassToAssignSubject(undefined);
    }
  }, [isAssignSubjectDialogOpen]);

  const handleEdit = useCallback((classData: IUsersData) => {
    setEditingClass(classData);
    onEditModalToggle();
  }, [onEditModalToggle]);

  const handleDeleteConfirmation = useCallback((classData: IUsersData) => {
    setEditingClass(classData);
    onDeleteConfirmationModalToggle();
  }, [onDeleteConfirmationModalToggle]);

  const handleViewDetails = useCallback((classData: IUsersData) => {
    setViewingClass(classData);
    onDetailsModalToggle();
  }, [onDetailsModalToggle]);

  const handleOpenAssignSubjectDialog = useCallback((classData: IUsersData) => {
    setClassToAssignSubject(classData);
    onAssignSubjectDialogToggle();
  }, [onAssignSubjectDialogToggle]);

  const columns = useMemo<ColumnDef<IUsersData>[]>(
    () => [
      {
        accessorKey: 'id',
        header: () => <DataGridRowSelectAll />,
        cell: ({ row }: { row: Row<IUsersData> }) => <DataGridRowSelect row={row} />,
        enableSorting: false, enableHiding: false, meta: { headerClassName: 'w-0' }
      },
      {
        accessorFn: (row: IUsersData) => row.name, id: 'name',
        header: ({ column }) => <DataGridColumnHeader title="Lớp" filter={
          <Input
            placeholder="Lọc..."
            value={(column.getFilterValue() as string) ?? ''}
            onChange={(event) => column.setFilterValue(event.target.value)}
            className="h-9 w-full max-w-40"
          />
        } column={column} />,
        enableSorting: true, meta: { className: 'min-w-[300px]', cellClassName: 'text-gray-800 font-normal' }
      },
      {
        accessorFn: (row: IUsersData) => row.description, id: 'description',
        header: ({ column }) => <DataGridColumnHeader title="Mô tả" column={column} />,
        enableSorting: true, cell: (info) => info.row.original.description,
        meta: { headerClassName: 'min-w-[180px]' }
      },
      {
        id: 'actions',
        header: () => '',
        enableSorting: false,
        cell: ({ row }: { row: Row<IUsersData> }) => (
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
                handleViewDetails: () => handleViewDetails(row.original),
                isAssignSubject: true,
                handleAssignSubject: () => handleOpenAssignSubjectDialog(row.original)
              })}
            </MenuItem>
          </Menu>
        ),
        meta: { headerClassName: 'w-[60px]' }
      }
    ],
    [isRTL, handleViewDetails, handleEdit, handleDeleteConfirmation, handleOpenAssignSubjectDialog]
  );

  return (
    <>
      <DataGrid
        columns={columns}
        data={classes || []}
        rowSelection={true}
        pagination={{ size: 10 }}
        sorting={[{ id: 'name', desc: false }]}
        layout={{ card: true }}
      />
      <Edit open={isModalEditOpen} onOpenChange={onEditModalToggle} editingClass={editingClass} />
      <DeleteConfirmation
        open={isModalDeleteConfirmationOpen}
        onOpenChange={onDeleteConfirmationModalToggle}
        classToDelete={editingClass}
      />
      <Details open={isModalDetailsOpen} onOpenChange={onDetailsModalToggle} classData={viewingClass} />
      <AssignSubjectDialog
        open={isAssignSubjectDialogOpen}
        onOpenChange={onAssignSubjectDialogToggle}
        classItem={classToAssignSubject}
        subjects={subjectsList}
        isLoadingSubjects={isLoadingSubjects}
        teachers={teachersList}
        isLoadingTeachers={isLoadingTeachers}
      />
    </>
  );
};

export { List };
