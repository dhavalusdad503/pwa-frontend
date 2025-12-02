import { formatDateTime } from "@/helper/dateUtils";

// AppointmentCard.jsx
export interface AppointmentCardProps {
  id?: string | number;
  patientName?: string;
  address?: string;
  startedAt: string;
  endedAt: string;
  serviceType: string | null;
  synced: number;
}
export default function AppointmentCard(data: AppointmentCardProps) {

  return (
    <div
      key={data?.id}
      className="w-full max-w-xl bg-white rounded-xl shadow p-4 border border-gray-200">
      {/* Header Row */}
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-lg text-gray-900">{data?.patientName}</h2>
        <p className="text-sm text-gray-600">{data?.startedAt && formatDateTime(data?.startedAt)} to {data?.endedAt && formatDateTime(data?.endedAt)}</p>
      </div>

      {/* Details */}
      <div className="text-sm text-gray-700 space-y-1">
        {/* <p className="text-gray-600">{data?.address || "fake address"}</p> */}
        <p>
          <span className="">Service:</span> {data?.serviceType}
        </p>
      </div>
      <div className="text-sm text-gray-700 space-y-1">
        <p>
          <span className="">Submitted:</span> {data?.synced === 1 ? "Yes" : "No"}
        </p>
      </div>
    </div>
  );
}
