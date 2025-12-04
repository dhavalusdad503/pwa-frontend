import moment from 'moment';

import { putItems, setMeta } from '@/db';
import { NewShiftSchemaType } from '@/types';

export const syncManager = async (userShifts: NewShiftSchemaType[]) => {
  try {
    // const lastSync = await getMeta('lastSyncAt') || 0;

    // Only sync if we have data
    // if (userShifts && userShifts.length > 0) {
    await putItems(userShifts);
    // } else {
    //   console.log('No shifts to sync');
    // }

    // Update timestamp
    await setMeta('lastSyncAt', moment().format());
  } catch (error) {
    console.error('Error in syncManager:', error);
  }
};
// export async function syncWithServer() {
//   const lastSync = await getMeta("lastSyncAt") || 0;

//   // Get server changes
//   const res = await fetch(`/api/items?updated_after=${lastSync}`);
//   const serverItems = await res.json();

//   // Update local DB
//   await putItems(serverItems);

//   // Update timestamp
//   await setMeta("lastSyncAt", Date.now());
// }
