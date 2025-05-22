import { useQuery } from '@tanstack/react-query';
import { Fragment, useCallback, useState } from 'react';
import { Container } from '@/components/container';
import { Toolbar, ToolbarActions, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import { useLayout } from '@/providers';
import { Button } from '@/components/ui/button';
import { SubjectList } from './blocks/SubjectList';
import { CreateSubject } from './blocks/CreateSubject';
import { ISubjectData, ApiSubjectsResponse } from './subjects.types';
import { callApiGetSubjects } from '@/api/subject';

export const Subjects = () => {
  const [isCreateSubjectModalOpen, setIsCreateSubjectModalOpen] = useState(false);
  const { currentLayout } = useLayout();

  const {
    data: subjects,
    isLoading,
    isError,
    error,
  } = useQuery<ISubjectData[], Error, ApiSubjectsResponse>({
    queryKey: ['subjects'],
    queryFn: callApiGetSubjects,
    select: (response) => response.data.data,
  });

  const handleOpenCreateSubjectModal = useCallback(() => {
    setIsCreateSubjectModalOpen(true);
  }, []);

  if (isLoading) {
    return (
      <Container>
        <div className="text-center p-5">Đang tải danh sách môn học...</div>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container>
        <div className="text-center p-5 text-red-500">
          Lỗi khi tải dữ liệu: {error?.message || 'Đã có lỗi không mong muốn xảy ra.'}
        </div>
      </Container>
    );
  }

  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle/>
            </ToolbarHeading>
            <ToolbarActions>
              <Button onClick={handleOpenCreateSubjectModal}>
                Tạo Môn học
              </Button>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <div className="grid gap-5 lg:gap-7.5">
          <SubjectList subjects={subjects || []} />
        </div>
      </Container>

      <CreateSubject
        open={isCreateSubjectModalOpen}
        onOpenChange={setIsCreateSubjectModalOpen}
      />
    </Fragment>
  );
};
