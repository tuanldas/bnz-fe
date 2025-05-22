import { ReactElement, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useLoaders } from '@/providers';
import { AppRoutingSetup } from '.';

const AppRouting = (): ReactElement => {
  const { setProgressBarLoader } = useLoaders();
  const location = useLocation();
  const currentRouteKey = location.pathname + location.search;
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (!location.hash) {
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
      return;
    }

    setProgressBarLoader(true);

    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const timer = setTimeout(() => {
      setProgressBarLoader(false);
    }, 300);

    return () => clearTimeout(timer);

  }, [currentRouteKey, location.hash, setProgressBarLoader]);

  return <AppRoutingSetup />;
};

export { AppRouting };
