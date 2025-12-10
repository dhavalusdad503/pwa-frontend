import Repeater from '@lib/Common/Repeater';

interface SkeletonProps {
  className?: string;
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, count = 1 }) => {
  return (
    <Repeater count={count}>
      <div
        className={`relative bg-gray-100 rounded overflow-hidden ${className}`}>
        <span className="absolute top-2/4 -translate-y-2/4 h-[200%] w-24 bg-white/70 blur-lg animate-skeleton -skew-x-[25deg]" />
      </div>
    </Repeater>
  );
};

export default Skeleton;
