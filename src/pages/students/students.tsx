import { callApiGetStudents } from '@/api/student.tsx';
import { useQuery } from '@tanstack/react-query';
import { Fragment, useCallback, useState } from 'react';
import { Container } from '@/components/container';
import { Toolbar, ToolbarActions, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import { useLayout } from '@/providers';
import { StudentList } from './blocks/StudentList';
import { CreateStudent } from './blocks/CreateStudent';
import { Button } from '@/components/ui/button.tsx';

export interface IStudentData {
  id: number;
  fullName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  classId: number;
}

export type StudentFormData = Omit<IStudentData, 'id' | 'className'>;

export type StudentIdentifier = Pick<IStudentData, 'id' | 'fullName'>;

const Students = () => {
  const [openCreateStudent, setOpenCreateStudent] = useState(false);
  const { currentLayout } = useLayout();
  const { data: studentApiResponse, isLoading } = useQuery<{ data: { data: IStudentData[] } }>({
    queryKey: ['students'],
    queryFn: callApiGetStudents
  });

  const handleOpenCreateStudent = useCallback(() => {
    setOpenCreateStudent(true);
  }, []);

  const handleCloseCreateStudent = useCallback((isOpen: boolean) => {
    setOpenCreateStudent(isOpen);
  }, []);


  const students = studentApiResponse?.data?.data;

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
                Tạo Học Sinh
              </Button>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <div className="grid gap-5 lg:gap-7.5">
          {isLoading && <div className="text-center p-5">Đang tải danh sách học sinh...</div>}
          {!isLoading && <StudentList students={students} />}
        </div>
      </Container>
      <CreateStudent open={openCreateStudent} onOpenChange={handleCloseCreateStudent} />
    </Fragment>
  );
};

export { Students };
