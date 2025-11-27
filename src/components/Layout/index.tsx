import type { PropsWithChildren } from 'react';
import Header from '@/components/Header';

const Layout = ({ children }: PropsWithChildren) => (
  <>
    <div className="sticky top-0 z-5">
      <Header />
    </div>
    <div className="p-3">
      <h3></h3>
      {children}
    </div>
  </>
);

export default Layout;
