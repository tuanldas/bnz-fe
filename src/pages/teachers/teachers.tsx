import { useQuery } from '@tanstack/react-query';
import { Fragment, useCallback, useState } from 'react';
import { Container } from '@/components/container';
import { Toolbar, ToolbarActions, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import { useLayout } from '@/providers';
import { TeacherList } from './blocks/TeacherList.tsx';
import { CreateTeacher } from './blocks/CreateTeacher.tsx';
import { Button } from '@/components/ui/button.tsx';
import { callApiGetTeachers } from '@/api/teacher.tsx';

export interface ITeacherData {
  id: number;
  fullName: string;
  dateOfBirth: string;
  password: string;
  email: string;
  phone: string;
}

export type TeacherFormData = Omit<ITeacherData, 'id' | 'className'>;
export type TeacherIdentifier = Pick<ITeacherData, 'id' | 'fullName'>;

const Teachers = () => {
  const [openCreateStudent, setOpenCreateStudent] = useState(false);
  const { currentLayout } = useLayout();
  const { data: teachersApiResponse, isLoading } = useQuery<{ data: { data: ITeacherData[] } }>({
    queryKey: ['teachers'],
    queryFn: callApiGetTeachers
  });

  const handleOpenCreateStudent = useCallback(() => {
    setOpenCreateStudent(true);
  }, []);

  const handleCloseCreateStudent = useCallback((isOpen: boolean) => {
    setOpenCreateStudent(isOpen);
  }, []);


  const teachers = teachersApiResponse?.data?.data;

  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
            </ToolbarHeading>
            <ToolbarActions>
              <Button onClick={handleOpenCreateStudent}>
                Tạo Giảng viên
              </Button>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <div className="grid gap-5 lg:gap-7.5">
          {isLoading && <div className="text-center p-5">Đang tải danh sách giảng viên...</div>}
          {!isLoading && <TeacherList teachers={teachers} />}
        </div>
      </Container>
      <CreateTeacher open={openCreateStudent} onOpenChange={handleCloseCreateStudent} />
    </Fragment>
  );
};

export { Teachers };
