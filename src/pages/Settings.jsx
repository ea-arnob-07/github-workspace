import { useSettings } from '../context/SettingsContext';
import { Moon, Sun, Monitor, Users, Package, Settings as SettingsIcon, LayoutList, Search, RotateCcw } from 'lucide-react';
import './Settings.css';

/**
 * Settings Page — Theme, pagination, default search type preferences.
 */
export default function Settings() {
  const {
    theme,
    setTheme,
    paginationSize,
    defaultSearchType,
    updateSetting,
    resetSettings,
  } = useSettings();

  return (
    <div className="page-container">
      <div className="settings-wrapper" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <div className="page-header">
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><SettingsIcon size={28} /> Settings</h1>
          <p>Customize your GitHub Workspace experience</p>
        </div>

        <div className="settings-grid">
          {/* Theme */}
        <section className="settings-section card">
          <div className="settings-section-header">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Monitor size={18} /> Appearance</h3>
            <p>Choose your preferred theme</p>
          </div>
          <div className="theme-options">
            {[
              { value: 'dark', icon: <Moon size={16} />, label: 'Dark' },
              { value: 'light', icon: <Sun size={16} />, label: 'Light' },
              { value: 'system', icon: <Monitor size={16} />, label: 'System' },
            ].map((option) => (
              <button
                key={option.value}
                className={`theme-option ${theme === option.value ? 'theme-option-active' : ''}`}
                onClick={() => setTheme(option.value)}
              >
                <span className="theme-option-icon">{option.icon}</span>
                <span className="theme-option-label">{option.label}</span>
                {theme === option.value && <span className="theme-check"></span>}
              </button>
            ))}
          </div>
        </section>

        {/* Pagination */}
        <section className="settings-section card">
          <div className="settings-section-header">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><LayoutList size={18} /> Pagination</h3>
            <p>Number of items per page</p>
          </div>
          <div className="radio-group">
            {[10, 20, 50].map((size) => (
              <label key={size} className="radio-option">
                <input
                  type="radio"
                  name="paginationSize"
                  value={size}
                  checked={paginationSize === size}
                  onChange={() => updateSetting('paginationSize', size)}
                />
                <span className="radio-custom" />
                <span className="radio-label">{size} items</span>
              </label>
            ))}
          </div>
        </section>

        {/* Default Search Type */}
        <section className="settings-section card">
          <div className="settings-section-header">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Search size={18} /> Default Search</h3>
            <p>Default search type when searching</p>
          </div>
          <div className="radio-group">
            {[
              { value: 'users', label: 'Users', icon: <Users size={14} style={{ marginRight: '4px' }} /> },
              { value: 'repositories', label: 'Repositories', icon: <Package size={14} style={{ marginRight: '4px' }} /> },
            ].map((option) => (
              <label key={option.value} className="radio-option">
                <input
                  type="radio"
                  name="defaultSearchType"
                  value={option.value}
                  checked={defaultSearchType === option.value}
                  onChange={() => updateSetting('defaultSearchType', option.value)}
                />
                <span className="radio-custom" />
                <span className="radio-label">
                  {option.icon} {option.label}
                </span>
              </label>
            ))}
          </div>
        </section>

        {/* Reset */}
        <section className="settings-section card">
          <div className="settings-section-header">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><RotateCcw size={18} /> Reset</h3>
            <p>Reset all settings to their defaults</p>
          </div>
          <button className="btn btn-danger" onClick={resetSettings}>
            Reset All Settings
          </button>
        </section>
      </div>
      </div>
    </div>
  );
}
