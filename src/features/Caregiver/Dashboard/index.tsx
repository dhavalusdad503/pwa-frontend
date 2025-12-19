import HomeVisits from '@features/Caregiver/HomeVisits';

const CaregiverDashboard = () => {
  const visitsToday = 3;
  const visitsThisWeek = 10;
  const visitsCompleted = 48;

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h1 className="text-xl font-bold text-gray-900">Welcome back!</h1>
        <p className="text-gray-500 mt-1">
          You have {visitsToday} visits scheduled today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Today Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            TODAY
          </div>
          <div className="text-3xl font-bold text-teal-900 mt-2">
            {visitsToday}
          </div>
          <div className="text-sm text-gray-500 mt-1">Visits</div>
        </div>

        {/* This Week Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            THIS WEEK
          </div>
          <div className="text-3xl font-bold text-teal-900 mt-2">
            {visitsThisWeek}
          </div>
          <div className="text-sm text-gray-500 mt-1">Visits</div>
        </div>

        {/* Completed Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            COMPLETED
          </div>
          <div className="text-3xl font-bold text-green-500 mt-2">
            {visitsCompleted}
          </div>
          <div className="text-sm text-gray-500 mt-1">This Month</div>
        </div>
      </div>

      {/* Recent Visits Section */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Visits</h2>
        <HomeVisits />
      </div>
    </div>
  );
};
export default CaregiverDashboard;
