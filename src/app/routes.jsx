import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { HomePage } from '../modules/home/HomePage.jsx';
import { MuseumPage } from '../modules/museum/MuseumPage.jsx';
import { FavoritesPage } from '../modules/favorites/FavoritesPage.jsx';
import { CountdownPage } from '../modules/countdown/CountdownPage.jsx';
import { PlaygroundPage } from '../modules/playground/PlaygroundPage.jsx';
import { SettingsPage } from '../modules/settings/SettingsPage.jsx';

function NotFoundPage() {
  return (
    <div className="text-center py-20">
      <h1 className="text-3xl font-display font-semibold text-oxblood-600 mb-2">Page not found</h1>
      <p className="text-charcoal-light">That corner of the keepsake doesn't exist yet.</p>
    </div>
  );
}

export function AppRoutes() {
  const location = useLocation();

  // Start each page from the top as it turns in.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.28, ease: 'easeInOut' }}
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/museum" element={<MuseumPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/countdown" element={<CountdownPage />} />
          <Route path="/playground" element={<PlaygroundPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}
