import { ROUTES } from '@constant/routesPath';
import Button from '@lib/Common/Button';
import { useNavigate } from 'react-router-dom';

import AppointmentCard, { type AppointmentCardProps } from './AppointmentCard';

export const appointments: AppointmentCardProps[] = [
  {
    name: 'Mary Johnson',
    date: 'Oct 28, 2025 - 2:00 PM',
    address: '123 Oak Street, Springfield',
    service: 'Wellness Check',
    status: 'Submitted'
  },
  {
    name: 'Robert Miller',
    date: 'Nov 3, 2025 - 10:30 AM',
    address: '45 Pine Avenue, Riverside',
    service: 'Blood Test',
    status: 'In Progress'
  },
  {
    name: 'Ava Thompson',
    date: 'Sep 14, 2025 - 4:15 PM',
    address: '908 Hill Road, Brighton',
    service: 'General Consultation',
    status: 'Pending'
  },
  {
    name: 'James Carter',
    date: 'Dec 2, 2025 - 1:45 PM',
    address: '67 Maple Street, Brookfield',
    service: 'Routine Checkup',
    status: 'Completed'
  },
  {
    name: 'Sophia Williams',
    date: 'Aug 19, 2025 - 11:00 AM',
    address: '312 Cedar Lane, Fairview',
    service: 'Dental Cleaning',
    status: 'Submitted'
  },
  {
    name: 'Benjamin Harris',
    date: 'Jul 7, 2025 - 9:00 AM',
    address: '940 Eastwood Blvd, Oakridge',
    service: 'Eye Examination',
    status: 'Rescheduled'
  },
  {
    name: 'Emma Davis',
    date: 'Jan 12, 2026 - 3:20 PM',
    address: '120 Birch Street, Pleasantville',
    service: 'Follow-up Visit',
    status: 'Pending'
  },
  {
    name: 'Daniel Scott',
    date: 'Oct 5, 2025 - 5:30 PM',
    address: '201 Sunset Drive, Lincoln Park',
    service: 'X-Ray Scan',
    status: 'Completed'
  },
  {
    name: 'Olivia Brown',
    date: 'Mar 22, 2026 - 8:45 AM',
    address: '550 Orchard Road, Lakeview',
    service: 'Vaccination',
    status: 'In Progress'
  },
  {
    name: 'Ethan Wilson',
    date: 'Feb 9, 2026 - 12:10 PM',
    address: '78 Willow Court, Meadowville',
    service: 'Physical Therapy',
    status: 'Submitted'
  }
];

const HomeVisits = () => {
  const Navigate = useNavigate();
  const handleNewShift = () => {
    // Logic to handle creating a new shift
    Navigate(ROUTES.NEW_SHIFT.path);
  };
  return (
    <>
      <div className="max-w-438px w-full m-auto">
        <div className="flex flex-col gap-2.5 w-full items-center ">
          <h4 className="text-2xl font-bold text-blackdark">Home Visits</h4>
          {/* <p className="text-base font-normal text-blackdark/60">
            Welcome Back! Please Enter Your Detail
          </p> */}
        </div>
        <div className="flex flex-col gap-2.5 w-full items-center ">
          <Button
            type="submit"
            variant="filled"
            // isLoading={isLoading}
            title="+ New Shift"
            className="w-md ! !font-bold !leading-5 "
            // isDisabled={isLoading}
            onClick={handleNewShift}
          />
          <p className="text-base font-normal text-blackdark">Visit History</p>
          {appointments.map((appointment) => (
            <AppointmentCard {...appointment} />
          ))}
        </div>
      </div>
    </>
  );
};

export default HomeVisits;
