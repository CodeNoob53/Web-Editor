import React, { useRef, useState } from 'react';
import { useDrop, useDrag } from 'react-dnd';
import { HTML_ELEMENTS } from '../../config/htmlElements';
import './CanvasElement.css';

const CanvasElement = ({
  element,
  elements,
  isSelected,
  onSelect,
  onUpdate,
  onAddElement,
  onMove,
  index = 0
}) => {
  const ref = useRef(null);
  const [dragOver, setDragOver] = useState(null); // 'top', 'bottom', 'inside', null
  
  const elementConfig = HTML_ELEMENTS[element.type];
  const canHaveChildren = elementConfig?.canHaveChildren || false;
  
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'CANVAS_ELEMENT',
    item: { id: element.id, type: element.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ['ELEMENT', 'CANVAS_ELEMENT'],
    hover: (item, monitor) => {
      if (!ref.current) return;
      
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      
      // Визначаємо зону drop
      if (canHaveChildren) {
        const topZone = hoverMiddleY * 0.3;
        const bottomZone = hoverMiddleY * 1.7;
        
        if (hoverClientY < topZone) {
          setDragOver('top');
        } else if (hoverClientY > bottomZone) {
          setDragOver('bottom');
        } else {
          setDragOver('inside');
        }
      } else {
        if (hoverClientY < hoverMiddleY) {
          setDragOver('top');
        } else {
          setDragOver('bottom');
        }
      }
    },
    drop: (item, monitor) => {
      setDragOver(null);
      
      if (!monitor.didDrop()) {
        const dropZone = dragOver;
        
        if (item.elementType) {
          // Новий елемент з toolbox
          if (dropZone === 'inside' && canHaveChildren) {
            return { parentId: element.id, index: 0 };
          } else if (dropZone === 'top') {
            return { parentId: element.parentId, index: index };
          } else if (dropZone === 'bottom') {
            return { parentId: element.parentId, index: index + 1 };
          }
        } else if (item.id && item.id !== element.id) {
          // Переміщення існуючого елемента
          if (dropZone === 'inside' && canHaveChildren) {
            const children = elements.filter(el => el.parentId === element.id);
            onMove(item.id, element.id, children.length);
          } else if (dropZone === 'top') {
            onMove(item.id, element.parentId, index);
          } else if (dropZone === 'bottom') {
            onMove(item.id, element.parentId, index + 1);
          }
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  }));

  // Очищуємо dragOver коли не hover
  React.useEffect(() => {
    if (!isOver) {
      setDragOver(null);
    }
  }, [isOver]);

  const children = elements.filter(el => el.parentId === element.id);

  // Combine drag and drop refs
  drag(drop(ref));

  const handleClick = (e) => {
    e.stopPropagation();
    onSelect(element.id);
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    if (!canHaveChildren && element.type !== 'img') {
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
      case 'img':
        return (
          <img 
            src={element.content || elementConfig.defaultContent} 
            alt={element.attributes?.alt || 'Image'} 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: element.styles.objectFit || 'cover',
              display: 'block'
            }}
            draggable={false}
          />
        );
      
      case 'input':
        return (
          <input 
            type={element.attributes?.type || 'text'}
            placeholder={element.content || elementConfig.defaultContent} 
            style={{ 
              width: '100%', 
              border: 'none', 
              outline: 'none', 
              background: 'transparent',
              fontSize: 'inherit',
              color: 'inherit',
              padding: '0'
            }}
            readOnly
          />
        );
      
      case 'textarea':
        return (
          <textarea 
            placeholder={element.content || elementConfig.defaultContent} 
            style={{ 
              width: '100%', 
              height: '100%',
              border: 'none', 
              outline: 'none', 
              background: 'transparent',
              fontSize: 'inherit',
              color: 'inherit',
              padding: '0',
              resize: 'none'
            }}
            readOnly
            value=""
          />
        );
      
      case 'select':
        return (
          <select 
            style={{ 
              width: '100%', 
              border: 'none', 
              outline: 'none', 
              background: 'transparent',
              fontSize: 'inherit',
              color: 'inherit'
            }}
            disabled
          >
            <option>Select option</option>
            {children.filter(child => child.type === 'option').map(option => (
              <option key={option.id} value={option.content}>
                {option.content}
              </option>
            ))}
          </select>
        );
      
      case 'button':
      case 'a':
        return element.content || elementConfig.defaultContent;
      
      default:
        // Для елементів з дітьми рендеримо дітей
        if (canHaveChildren) {
          return children.map(child => (
            <CanvasElement
              key={child.id}
              element={child}
              elements={elements}
              isSelected={isSelected}
              onSelect={onSelect}
              onUpdate={onUpdate}
              onAddElement={onAddElement}
              onMove={onMove}
              index={children.findIndex(c => c.id === child.id)}
            />
          ));
        }
        
        // Для текстових елементів
        return element.content || elementConfig.defaultContent;
    }
  };

  const elementStyle = {
    ...element.styles,
    opacity: isDragging ? 0.5 : 1,
    minHeight: (canHaveChildren && children.length === 0) ? '50px' : 'auto',
    position: 'relative',
    boxSizing: 'border-box'
  };

  // Додаємо стилі для drop zones
  const getDropZoneStyle = () => {
    if (!isOver || !dragOver) return {};
    
    const baseStyle = {
      position: 'absolute',
      left: '0',
      right: '0',
      height: '3px',
      backgroundColor: '#007AFF',
      zIndex: 1000,
      pointerEvents: 'none'
    };
    
    if (dragOver === 'top') {
      return { ...baseStyle, top: '-2px' };
    } else if (dragOver === 'bottom') {
      return { ...baseStyle, bottom: '-2px' };
    } else if (dragOver === 'inside') {
      return {
        position: 'absolute',
        inset: '0',
        backgroundColor: 'rgba(0, 122, 255, 0.1)',
        border: '2px dashed #007AFF',
        borderRadius: '4px',
        zIndex: 1000,
        pointerEvents: 'none'
      };
    }
    
    return {};
  };

  return (
    <div
      ref={ref}
      className={`canvas-element ${isSelected ? 'selected' : ''} ${isOver ? 'drop-target' : ''}`}
      style={elementStyle}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      data-element-type={element.type}
    >
      {/* Drop zone indicator */}
      {isOver && dragOver && (
        <div style={getDropZoneStyle()} />
      )}
      
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
      
      {/* Placeholder для пустих контейнерів */}
      {canHaveChildren && children.length === 0 && !isOver && (
        <div className="drop-placeholder">
          <div style={{
            padding: '20px',
            textAlign: 'center',
            color: '#8e8e93',
            fontSize: '14px',
            border: '2px dashed #e5e5ea',
            borderRadius: '8px',
            backgroundColor: '#f8f9fa'
          }}>
            Перетягніть елементи сюди
          </div>
        </div>
      )}
    </div>
  );
};

export default CanvasElement;