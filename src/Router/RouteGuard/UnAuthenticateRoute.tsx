import { type PropsWithChildren, Suspense } from 'react';

import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { ROUTES } from '@/constant/routesPath';
import SectionLoader from '@/lib/Common/Loader/Spinner';

import { currentUser } from '../../redux/ducks/user';

export const UnAuthenticateRoute: React.FC<PropsWithChildren> = ({
  children
}) => {
  const { isLoggedIn } = useSelector(currentUser);

  if (!isLoggedIn) {
    return <Suspense fallback={<SectionLoader />}>{children}</Suspense>;
  }

  return <Navigate to={ROUTES.DEFAULT.path} />;
};

export default UnAuthenticateRoute;
