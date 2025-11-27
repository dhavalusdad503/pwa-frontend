import { type PropsWithChildren, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { currentUser } from '../../redux/ducks/user';
import { ROUTES } from '@/constant/routesPath';
import SectionLoader from '@/lib/Common/Loader/Spinner';

const AuthenticateRoute: React.FC<PropsWithChildren> = ({ children }) => {
  const { isLoggedIn } = useSelector(currentUser);

  if (!isLoggedIn) {
    return <Navigate to={ROUTES.DEFAULT.path} />;
  }

  return <Suspense fallback={<SectionLoader />}>{children}</Suspense>;
};

export default AuthenticateRoute;
