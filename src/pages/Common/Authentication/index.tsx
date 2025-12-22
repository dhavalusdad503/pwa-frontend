import Login from '@features/Authentication';
import { useLocation } from 'react-router-dom';
import { ROUTES } from '@constant/routesPath';
import ForgetPassword from '@features/Authentication/Components/ForgetPassword';
import ResetPassword from "@features/Authentication/Components/ConfirmationPassword"
import OtpConfirmation from '@features/Authentication/Components/OtpConfirmation';


const AuthenticationPage = () => {

  const location = useLocation();
  const isLogin = location.pathname === ROUTES.LOGIN.path;
  const isForgot = location.pathname === ROUTES.FORGET_PASSWORD.path;
  const isReset = location.pathname === ROUTES.RESET_PASSWORD.path;
  // const isOTPConformation = location.pathname === ROUTES.OTP_CONFIRMATION.path;

  return (
    <>
      {isLogin && <Login />}
      {isForgot && <ForgetPassword />}
      {isReset && <ResetPassword />}
      {/* {isOTPConformation && <OtpConfirmation />} */}
    </>
  );
};
export default AuthenticationPage;
