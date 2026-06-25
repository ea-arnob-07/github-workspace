import { BrowserRouter } from 'react-router-dom';
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
        <BrowserRouter>
          <AnimatedBackground />
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </SettingsProvider>
  );
}

export default App;
