import React from 'react';
import { Download, Moon, Sun, Grid as Grid3X3, ZoomIn, ZoomOut, RotateCcw, RotateCw, Save } from 'lucide-react';
import './TopBar.css';

const TopBar = ({ 
  onExport, 
  isDarkMode, 
  onToggleDarkMode, 
  showGrid, 
  onToggleGrid,
  zoom,
  onZoomChange
}) => {
  const handleZoomIn = () => {
    onZoomChange(Math.min(zoom + 10, 200));
  };

  const handleZoomOut = () => {
    onZoomChange(Math.max(zoom - 10, 50));
  };

  const handleZoomReset = () => {
    onZoomChange(100);
  };

  return (
    <div className="top-bar">
      <div className="top-bar-section">
        <div className="logo">
          <div className="logo-icon">⚡</div>
          <span>Visual Editor</span>
        </div>
      </div>

      <div className="top-bar-section center">
        <div className="tool-group">
          <button 
            className="tool-button"
            onClick={handleZoomOut}
            title="Зменшити масштаб"
          >
            <ZoomOut size={16} />
          </button>
          
          <div className="zoom-display" onClick={handleZoomReset}>
            {zoom}%
          </div>
          
          <button 
            className="tool-button"
            onClick={handleZoomIn}
            title="Збільшити масштаб"
          >
            <ZoomIn size={16} />
          </button>
        </div>

        <div className="tool-group">
          <button 
            className={`tool-button ${showGrid ? 'active' : ''}`}
            onClick={onToggleGrid}
            title="Показати/сховати сітку"
          >
            <Grid3X3 size={16} />
          </button>
        </div>
      </div>

      <div className="top-bar-section">
        <div className="tool-group">
          <button 
            className="tool-button"
            onClick={onToggleDarkMode}
            title={isDarkMode ? 'Світла тема' : 'Темна тема'}
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          
          <button 
            className="tool-button primary"
            onClick={onExport}
            title="Експортувати HTML"
          >
            <Download size={16} />
            <span>Експорт</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopBar;