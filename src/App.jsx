import { HashRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { AppRoutes } from './routes/AppRoutes';
import AnimatedBackground from './components/layout/AnimatedBackground';

/**
 * App — Root component.
 * Wraps the app with all context providers and router.
 * Provider order: Settings (theme) > Auth > Router.
 */
function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <HashRouter>
          <AnimatedBackground />
          <AppRoutes />
        </HashRouter>
      </AuthProvider>
    </SettingsProvider>
  );
}

export default App;
