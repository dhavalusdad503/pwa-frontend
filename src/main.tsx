import { createRoot } from 'react-dom/client';
import '@/index.css';
import { registerSW } from 'virtual:pwa-register';

import App from '@/App';

registerSW({
  onNeedRefresh() {
    console.log('New version available');
  },
  onOfflineReady() {
    console.log('Ready to work offline!');
  }
});

createRoot(document.getElementById('root')!).render(<App />);
