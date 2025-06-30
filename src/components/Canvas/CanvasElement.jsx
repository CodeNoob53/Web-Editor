import React, { useRef } from 'react';
import { useDrop, useDrag } from 'react-dnd';
import './CanvasElement.css';

const CanvasElement = ({
  element,
  elements,
  isSelected,
  onSelect,
  onUpdate,
  onAddElement,
  onMove
}) => {
  const ref = useRef(null);
  
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'CANVAS_ELEMENT',
    item: { id: element.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ['ELEMENT', 'CANVAS_ELEMENT'],
    drop: (item, monitor) => {
      if (!monitor.didDrop()) {
        if (item.elementType) {
          // New element from toolbox
          return { parentId: element.id };
        } else if (item.id && item.id !== element.id) {
          // Moving existing element
          onMove(item.id, element.id, 0);
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  }));

  const children = elements.filter(el => el.parentId === element.id);
  const canHaveChildren = ['div', 'section', 'nav', 'article'].includes(element.type);

  // Combine drag and drop refs
  drag(drop(ref));

  const handleClick = (e) => {
    e.stopPropagation();
    onSelect(element.id);
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    if (element.type === 'text') {
      const newContent = prompt('Введіть текст:', element.content);
      if (newContent !== null) {
        onUpdate(element.id, { content: newContent });
      }
    }
  };

  const handlePositionChange = (e, direction) => {
    e.preventDefault();
    e.stopPropagation();
    
    const currentValue = parseInt(element.styles[direction]) || 0;
    const newValue = e.shiftKey ? currentValue + 10 : currentValue + 1;
    
    onUpdate(element.id, {
      styles: {
        ...element.styles,
        position: element.styles.position || 'relative',
        [direction]: `${newValue}px`
      }
    });
  };

  const renderContent = () => {
    switch (element.type) {
      case 'text':
        return element.content || 'Текст';
      case 'button':
        return element.content || 'Кнопка';
      case 'img':
        return (
          <img 
            src={element.content || 'https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg?auto=compress&cs=tinysrgb&w=400'} 
            alt="Element" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            draggable={false}
          />
        );
      case 'input':
        return (
          <input 
            type="text" 
            placeholder={element.content || 'Введіть текст'} 
            style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent' }}
            readOnly
          />
        );
      default:
        return null;
    }
  };

  const elementStyle = {
    ...element.styles,
    opacity: isDragging ? 0.5 : 1,
    minHeight: element.type === 'div' && children.length === 0 ? '50px' : 'auto',
  };

  return (
    <div
      ref={ref}
      className={`canvas-element ${isSelected ? 'selected' : ''} ${isOver && canHaveChildren ? 'drop-target' : ''}`}
      style={elementStyle}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      data-element-type={element.type}
    >
      {isSelected && (
        <div className="element-overlay">
          <div className="element-label">
            {element.type}
            {element.className && ` .${element.className}`}
          </div>
          <div className="element-controls">
            <button 
              className="position-control"
              onMouseDown={(e) => handlePositionChange(e, 'top')}
              title="Вгору (Shift+10px)"
            >
              ↑
            </button>
            <button 
              className="position-control"
              onMouseDown={(e) => handlePositionChange(e, 'left')}
              title="Вліво (Shift+10px)"
            >
              ←
            </button>
            <button 
              className="position-control"
              onMouseDown={(e) => handlePositionChange(e, 'right')}
              title="Вправо (Shift+10px)"
            >
              →
            </button>
            <button 
              className="position-control"
              onMouseDown={(e) => handlePositionChange(e, 'bottom')}
              title="Вниз (Shift+10px)"
            >
              ↓
            </button>
          </div>
        </div>
      )}
      
      {renderContent()}
      
      {canHaveChildren && children.map(child => (
        <CanvasElement
          key={child.id}
          element={child}
          elements={elements}
          isSelected={isSelected}
          onSelect={onSelect}
          onUpdate={onUpdate}
          onAddElement={onAddElement}
          onMove={onMove}
        />
      ))}
      
      {canHaveChildren && children.length === 0 && isOver && (
        <div className="drop-placeholder">
          Відпустіть тут
        </div>
      )}
    </div>
  );
};

export default CanvasElement;