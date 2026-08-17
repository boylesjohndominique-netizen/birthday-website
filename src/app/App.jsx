import { useState } from 'react';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { AppShell } from '../components/layout/AppShell.jsx';
import { ToastProvider } from '../components/ui/Toast.jsx';
import { IntroGate } from '../modules/intro/IntroGate.jsx';
import { AppRoutes } from './routes.jsx';

export default function App() {
  const [opened, setOpened] = useState(false);

  return (
    <MotionConfig reducedMotion="user">
      <ToastProvider>
        {/* inert keeps the app out of the tab order and AT while the gate is up */}
        <div inert={!opened}>
          <AppShell>
            <AppRoutes />
          </AppShell>
        </div>
        <AnimatePresence>
          {!opened && <IntroGate onOpen={() => setOpened(true)} />}
        </AnimatePresence>
      </ToastProvider>
    </MotionConfig>
  );
}
