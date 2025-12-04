import { useEffect, useState } from 'react';

import { useGetUserShifts } from '@api/newShift';
import { ROUTES } from '@constant/routesPath';
import AppointmentCard from '@features/HomeVisits/AppointmentCard';
import Button from '@lib/Common/Button';
import { useNavigate } from 'react-router-dom';

import { getAllForms } from '@/db';
import { syncManager } from '@/db/syncManager';
import { NewShiftSchemaType } from '@/types';



const HomeVisits = () => {
  const Navigate = useNavigate();
  const { data: userShifts } = useGetUserShifts();
  const [localShifts, setLocalShifts] = useState<NewShiftSchemaType[]>([]);

  const handleNewShift = () => {
    // Logic to handle creating a new shift
    Navigate(ROUTES.NEW_SHIFT.path);
  };

  // Load from local DB
  async function loadLocal() {
    const data = await getAllForms();
    setLocalShifts(data);

  }

  useEffect(() => {
    // // 1. Load instantly from IndexedDB
    // loadLocal();

    // // 2. Sync with server (pass userShifts data)
    // syncManager(userShifts).then(loadLocal);
    
    if (navigator.onLine) {
      syncManager(userShifts).then(loadLocal);
    } else {
      loadLocal()
    }
  }, [userShifts]);

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
          <p className="text-base text-blackdark">Visit History</p>
          {localShifts?.map((shift) => (
            <AppointmentCard {...shift} />
          ))}
        </div>
      </div>
    </>
  );
};

export default HomeVisits;
