import './Tabs.css';

/**
 * Tabs — Reusable tab navigation component.
 * @param {{ tabs: Array<{id, label, icon?}>, activeTab: string, onChange: Function }} props
 */
export default function Tabs({ tabs, activeTab, onChange }) {
  return (
    <div className="tabs-container">
      <div className="tabs-list">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-item ${activeTab === tab.id ? 'tab-active' : ''}`}
            onClick={() => onChange(tab.id)}
          >
            {tab.icon && <span className="tab-icon">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className="tab-count">{tab.count}</span>
            )}
          </button>
        ))}
      </div>
      <div className="tabs-indicator-track" />
    </div>
  );
}
