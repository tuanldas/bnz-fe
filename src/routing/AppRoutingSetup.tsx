import {ReactElement} from 'react';
import {Navigate, Route, Routes} from 'react-router';
import {DefaultPage} from '@/pages/dashboards';

import {AuthPage} from '@/auth';
import {RequireAuth} from '@/auth/RequireAuth';
import {Demo1Layout} from '@/layouts/demo1';
import {ErrorsRouting} from '@/errors';
import {Classes} from '@/pages/classes/Classes.tsx';

const AppRoutingSetup = (): ReactElement => {
  return (
    <Routes>
      <Route element={<RequireAuth />}>
        <Route element={<Demo1Layout />}>
          <Route path="/" element={<DefaultPage />} />
          <Route path="/classes" element={<Classes />} />
        </Route>
      </Route>
      <Route path="error/*" element={<ErrorsRouting />} />
      <Route path="auth/*" element={<AuthPage />} />
      <Route path="*" element={<Navigate to="/error/404" />} />
    </Routes>
  );
};

export { AppRoutingSetup };
