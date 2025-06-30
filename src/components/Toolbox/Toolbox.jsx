import React from 'react';
import { useDrag } from 'react-dnd';
import { 
  Square, 
  Type, 
  Image, 
  MousePointer, 
  FormInput,
  Navigation,
  Layout,
  FileText
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

const DraggableElement = ({ elementType, onAddElement }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'ELEMENT',
    item: { elementType },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        onAddElement(item.elementType, dropResult.parentId, dropResult.index);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const elementConfig = HTML_ELEMENTS[elementType];
  if (!elementConfig) return null;

  const IconComponent = ICON_MAP[elementConfig.icon] || Square;

  return (
    <div
      ref={drag}
      className={`toolbox-item ${isDragging ? 'dragging' : ''}`}
      onClick={() => onAddElement(elementType)}
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

const Toolbox = ({ onAddElement }) => {
  return (
    <div className="toolbox">
      <div className="toolbox-header">
        <h3>Елементи</h3>
        <div className="toolbox-subtitle">Перетягніть або клікніть</div>
      </div>
      
      <div className="toolbox-content">
        {Object.entries(ELEMENT_GROUPS).map(([groupKey, group]) => (
          <div key={groupKey} className="toolbox-section">
            <div className="toolbox-section-title">{group.title}</div>
            <div className="toolbox-items">
              {group.elements.map(elementType => (
                <DraggableElement
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