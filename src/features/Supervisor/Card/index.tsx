import { VisitCardResponse } from '@api/types/supervisor.dto';
import { formatDate } from '@helper/dateUtils';
import { combineName } from '@helper/index';

export default function VisitCard(data: VisitCardResponse) {
  const details = [
    {
      label: 'Caregiver',
      value:
        (data?.caregiver &&
          combineName({
            names: [data?.caregiver?.firstName, data?.caregiver?.lastName]
          })) ||
        '-'
    },
    {
      label: 'Service',
      value: data?.serviceType || '-'
    },
    {
      label: 'Status',
      value: data?.submittedAt ? 'Submitted' : 'Pending'
    }
  ];

  return (
    <div
      key={data?.id}
      className="w-full max-w-xl bg-white rounded-xl shadow p-4 border border-gray-200">
      {/* Header Row */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg text-gray-900">{data?.patient?.name || '-'}</h2>
        <p className="text-sm text-gray-600">
          {(data?.createdAt && formatDate(data?.createdAt)) || '-'}
        </p>
      </div>
      {/* Details */}
      {details.map((item) => (
        <div className="text-sm text-gray-700 space-y-1">
          <p>
            <span className="">{item?.label}:</span> {item?.value}
          </p>
        </div>
      ))}
    </div>
  );
}
