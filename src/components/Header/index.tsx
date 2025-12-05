import { useOfflineSync } from '@hooks/useOfflineFormSync';

const Header = () => {
  const { triggerFullSync, isSyncing, isOnline, synced } = useOfflineSync();

  const handleSyncClick = () => {
    if (!isSyncing && isOnline) {
      triggerFullSync();  // Full sync - fetches all visits
    }
  };

  return (
    <>
      <nav className="border-gray-200 bg-gray-500">
        <div className="flex flex-wrap items-center justify-between mx-auto p-4">
          <span className="text-white font-bold">HVA</span>

          {/* Sync Button */}
          <div className="flex items-center gap-2">
         
            <span
              className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400'}`}
              title={isOnline ? 'Online' : 'Offline'}
            />

            {/* Sync Button */}
            <button
              onClick={handleSyncClick}
              disabled={isSyncing || !isOnline}
              className={`
                flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium
                transition-all duration-200
                ${isSyncing
                  ? 'bg-blue-400 text-white cursor-wait'
                  : isOnline
                    ? 'bg-white text-gray-700 hover:bg-gray-100 active:bg-gray-200'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
              title={isSyncing ? 'Syncing...' : isOnline ? 'Sync now' : 'Offline - cannot sync'}
            >
              {/* Sync Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
              <span>{isSyncing ? 'Syncing...' : 'Sync'}</span>
            </button>

            {/* Sync status indicator */}
            {synced && !isSyncing && (
              <span className="text-green-300 text-xs">✓</span>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
