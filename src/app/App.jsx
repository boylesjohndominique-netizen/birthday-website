import { AppShell } from '../components/layout/AppShell.jsx';
import { ToastProvider } from '../components/ui/Toast.jsx';
import { AppRoutes } from './routes.jsx';

export default function App() {
  return (
    <ToastProvider>
      <AppShell>
        <AppRoutes />
      </AppShell>
    </ToastProvider>
  );
}
