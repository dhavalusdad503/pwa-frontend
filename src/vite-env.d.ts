declare module '*.svg?react' {
  import { FC, SVGProps } from 'react';
  const ReactComponent: FC<SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}
/// <reference types="vite/client" />

declare module 'virtual:pwa-register';
declare module 'virtual:pwa-register/react';
