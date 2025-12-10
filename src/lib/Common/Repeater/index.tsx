import React, { Fragment, PropsWithChildren } from 'react';

interface RepeaterProps extends PropsWithChildren {
  count?: number;
}

export const Repeater: React.FC<RepeaterProps> = ({ count = 1, children }) =>
  count === 1
    ? children // No unnecessary fragment wrapping
    : Array.from({ length: count }, (_, i: number) => (
        <Fragment key={i}>{children}</Fragment>
      ));

export default Repeater;
