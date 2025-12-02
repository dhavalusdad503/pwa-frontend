import { useEffect, useState } from 'react';

import { getDefaultRouteByRole } from '@config/defaultRoutes';
import { ROUTES } from '@constant/routesPath';
import SectionLoader from '@lib/Common/Loader/Spinner';
import { currentUser } from '@redux/ducks/user';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Root = () => {
  const { token, role } = useSelector(currentUser);
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    if (token) {
      navigate(getDefaultRouteByRole(role?.name));
    } else {
      navigate(ROUTES.LOGIN.path);
    }
    setLoader(false);
  }, []);

  return loader ? <SectionLoader /> : null;
};

export default Root;
