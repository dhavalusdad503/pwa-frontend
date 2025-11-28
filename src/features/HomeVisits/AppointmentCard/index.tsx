// AppointmentCard.jsx
export interface AppointmentCardProps {
  name: string;
  date: string;
  address: string;
  service: string;
  status: string;
}
export default function AppointmentCard(data: AppointmentCardProps) {
  return (
    <div
      key={data?.name}
      className="w-full max-w-xl bg-white rounded-xl shadow p-4 border border-gray-200">
      {/* Header Row */}
      <div className="flex justify-between items-start mb-2">
        <h2 className="font-semibold text-lg text-gray-900">{data?.name}</h2>
        <p className="text-sm text-gray-600">{data?.date}</p>
      </div>

      {/* Details */}
      <div className="text-sm text-gray-700 space-y-1">
        <p className="text-gray-600">{data?.address}</p>
        <p>
          <span className="font-medium">Service:</span> {data?.service}
        </p>
        <p>
          <span className="font-medium">Status:</span>{' '}
          <span className="text-blue-600">{data?.status}</span>
        </p>
      </div>
    </div>
  );
}
