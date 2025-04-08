import {callApiGetStudents} from '@/api/class.tsx';
import {useQuery} from 'react-query';
import {Fragment} from 'react';

import {Container} from '@/components/container';
import {Toolbar, ToolbarHeading, ToolbarPageTitle} from '@/partials/toolbar';

import {useLayout} from '@/providers';
import {List} from '@/pages/classes/blocks/List.tsx';

const Classes = () => {
    const {currentLayout} = useLayout();
    const {data, isLoading, error} = useQuery({
        queryKey: ['Classes'],
        queryFn: callApiGetStudents,
    });
    return <>
        <Fragment>
            {currentLayout?.name === 'demo1-layout' && (
                <Container>
                    <Toolbar>
                        <ToolbarHeading>
                            <ToolbarPageTitle/>
                        </ToolbarHeading>
                    </Toolbar>
                </Container>
            )}

            <Container>
                <div className="grid gap-5 lg:gap-7.5">
                    <List classes={data?.data?.data}/>
                </div>
            </Container>
        </Fragment>
    </>;
};

export {Classes};
