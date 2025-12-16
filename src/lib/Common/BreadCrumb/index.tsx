import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

import Icon from '../Icon';

interface BreadcrumbProps {
  breadcrumbs: {
    label: string;
    path?: string;
    isActive?: boolean;
    onBack?: () => void;
  }[];
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  breadcrumbs,
  className = ''
}) => {
  const navigate = useNavigate();
  const handleBack = (crumb?: { path?: string; onBack?: () => void }) => {
    if (crumb?.onBack) {
      crumb.onBack();
    } else if (crumb?.path) {
      navigate(crumb.path);
    }
  };
  return (
    <div className={`inline-flex gap-2 items-center mb-2 ${className}`}>
      <Icon
        name="arrowLeft"
        className="font-bold cursor-pointer"
        onClick={() => handleBack(breadcrumbs?.[0])}
      />
      <span>|</span>
      <span className="text-gray-500 font-normal text-xs sm:text-sm text-left">
        {breadcrumbs.map((crumb, idx) => (
          <span
            key={crumb.label}
            onClick={() => handleBack(crumb)}
            className={clsx({
              'text-xs sm:text-sm text-Primary-800 font-medium ml-1':
                crumb.isActive,
              'cursor-pointer': !!crumb.path || !!crumb.onBack
            })}>
            {crumb.label}
            {idx < breadcrumbs.length - 1 && ' > '}
          </span>
        ))}
      </span>
    </div>
  );
};

export default Breadcrumb;
