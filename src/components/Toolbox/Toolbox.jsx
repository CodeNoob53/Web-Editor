import React from 'react';
import { 
  Square, 
  Type, 
  Image, 
  MousePointer, 
  FormInput,
  Navigation,
  Layout,
  FileText,
  Info
} from 'lucide-react';
import { HTML_ELEMENTS, ELEMENT_GROUPS } from '../../config/htmlElements';
import './Toolbox.css';

// Маппінг іконок
const ICON_MAP = {
  Square,
  Type,
  Image,
  MousePointer,
  FormInput,
  Navigation,
  Layout,
  FileText
};

const ToolboxItem = ({ elementType, onAddElement, disabled = false }) => {
  const elementConfig = HTML_ELEMENTS[elementType];
  if (!elementConfig) return null;

  const IconComponent = ICON_MAP[elementConfig.icon] || Square;

  return (
    <div
      className={`toolbox-item ${disabled ? 'disabled' : ''}`}
      onClick={() => !disabled && onAddElement(elementType)}
      title={elementConfig.description}
    >
      <div className="toolbox-item-icon">
        <IconComponent size={20} />
      </div>
      <div className="toolbox-item-content">
        <div className="toolbox-item-label">{elementConfig.label}</div>
        <div className="toolbox-item-description">{elementConfig.description}</div>
      </div>
    </div>
  );
};

const Toolbox = ({ onAddElement, selectedElement }) => {
  const selectedConfig = selectedElement ? HTML_ELEMENTS[selectedElement.type] : null;
  const canHaveChildren = selectedConfig?.canHaveChildren || false;
  const targetInfo = selectedElement && canHaveChildren 
    ? `Додати в: ${selectedConfig.label}` 
    : 'Додати в: Основний контейнер';

  return (
    <div className="toolbox">
      <div className="toolbox-header">
        <h3>Елементи</h3>
        <div className="toolbox-subtitle">Натисніть щоб додати</div>
      </div>

      {/* Інформація про цільовий контейнер */}
      <div className="target-info">
        <div className="target-info-content">
          <Info size={16} className="target-info-icon" />
          <span className="target-info-text">{targetInfo}</span>
        </div>
        {selectedElement && canHaveChildren && (
          <div className="target-element">
            <div className="target-element-tag">{selectedElement.type}</div>
            {selectedElement.className && (
              <div className="target-element-class">.{selectedElement.className}</div>
            )}
          </div>
        )}
      </div>
      
      <div className="toolbox-content">
        {Object.entries(ELEMENT_GROUPS).map(([groupKey, group]) => (
          <div key={groupKey} className="toolbox-section">
            <div className="toolbox-section-title">{group.title}</div>
            <div className="toolbox-items">
              {group.elements.map(elementType => (
                <ToolboxItem
                  key={elementType}
                  elementType={elementType}
                  onAddElement={onAddElement}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Toolbox;