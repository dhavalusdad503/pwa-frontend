import Visits from "@features/admin/Visits";


const VisitsPage = ({isDashboard = false}:{isDashboard: boolean}) => {
  return (<Visits isDashboard={isDashboard}/>);
}

export default VisitsPage;