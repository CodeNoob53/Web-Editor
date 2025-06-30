import React from 'react';
import StyleControls from './StyleControls';
import LayoutControls from './LayoutControls';
import ContentControls from './ContentControls';
import './SettingsPanel.css';

const SettingsPanel = ({ element, onUpdateElement }) => {
  if (!element) {
    return (
      <div className="settings-panel">
        <div className="settings-header">
          <h3>Налаштування</h3>
        </div>
        <div className="settings-empty">
          <div className="empty-icon">⚙️</div>
          <p>Виберіть елемент для налаштування</p>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-panel">
      <div className="settings-header">
        <h3>Налаштування</h3>
        <div className="element-info">
          <span className="element-type">{element.type}</span>
          <span className="element-id">#{element.id.slice(0, 8)}</span>
        </div>
      </div>

      <div className="settings-content">
        <ContentControls 
          element={element} 
          onUpdate={onUpdateElement} 
        />
        
        <LayoutControls 
          element={element} 
          onUpdate={onUpdateElement} 
        />
        
        <StyleControls 
          element={element} 
          onUpdate={onUpdateElement} 
        />
      </div>
    </div>
  );
};

export default SettingsPanel;