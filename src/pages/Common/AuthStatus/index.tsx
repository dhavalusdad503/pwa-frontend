import VerifyingAccess from "@components/common/VerifyingAccess"


const AuthStatus = ({ status }: { status: string }) => {

  switch (status) {
    case 'verifying':
      return <VerifyingAccess />
    case 'loading':
      return <div>Loading...</div>
    case 'offline':
      return <div>Offline</div>
    case 'error':
      return <div>Error</div>
    default:
      return <div>Unknown status</div>
  }
}
export default AuthStatus