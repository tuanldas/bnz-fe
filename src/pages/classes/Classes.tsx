import { callApiGetClasses } from '@/api/class.tsx';
import { useQuery } from '@tanstack/react-query';
import { Fragment, useState } from 'react';

import { Container } from '@/components/container';
import { Toolbar, ToolbarActions, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';

import { useLayout } from '@/providers';
import { List } from '@/pages/classes/blocks/List.tsx';
import { Create } from '@/pages/classes/blocks/Create.tsx';
import { Button } from '@/components/ui/button.tsx';

const Classes = () => {
  const [openCreate, setOpenCreate] = useState(false);
  const { currentLayout } = useLayout();
  const { data } = useQuery({
    queryKey: ['classes'],
    queryFn: callApiGetClasses
  });

  const onCreate = () => {
    return setOpenCreate(!openCreate);
  };

  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
            </ToolbarHeading>
            <ToolbarActions>
              <Button onClick={onCreate}>
                Tạo lớp
              </Button>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <div className="grid gap-5 lg:gap-7.5">
          <List classes={data?.data?.data} />
        </div>
      </Container>
      <Create open={openCreate} onOpenChange={onCreate} />
    </Fragment>
  );
};

export { Classes };
