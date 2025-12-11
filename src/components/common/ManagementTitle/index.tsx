import Icon from '@lib/Common/Icon';
import { useNavigate } from 'react-router-dom';

export const ManagementTitle = ({
  label,
  path
}: {
  label?: string;
  path: string;
}) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white flex items-center justify-between py-2.5 sm:px-5 rounded-t-10px">
      <h5 className="text-base sm:text-xl font-semibold leading-5 sm:leading-26px text-neutral-800 truncate w-[calc(100%-80px)]">
        {label}
      </h5>
      <div
        className="flex items-center gap-1.5 cursor-pointer"
        onClick={() => navigate(path)}>
        <span className="text-sm sm:text-base font-medium leading-18px text-Primary-500">
          See All
        </span>
        <Icon name="rightArrow" />
      </div>
    </div>
  );
};
