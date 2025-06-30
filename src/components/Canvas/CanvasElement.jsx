import React, { useRef } from 'react';
import { HTML_ELEMENTS } from '../../config/htmlElements';
import './CanvasElement.css';

const CanvasElement = ({
  element,
  elements,
  isSelected,
  onSelect,
  onUpdate,
  level = 0
}) => {
  const ref = useRef(null);
  
  const elementConfig = HTML_ELEMENTS[element.type];
  const canHaveChildren = elementConfig?.canHaveChildren || false;
  const children = elements.filter(el => el.parentId === element.id);

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
      
      case 'ul':
      case 'ol':
        // Для списків рендеримо дочірні li елементи
        return children.map(child => (
          <CanvasElement
            key={child.id}
            element={child}
            elements={elements}
            isSelected={isSelected}
            onSelect={onSelect}
            onUpdate={onUpdate}
            level={level + 1}
          />
        ));
      
      case 'button':
      case 'a':
      case 'h1':
      case 'h2':
      case 'h3':
      case 'p':
      case 'span':
      case 'strong':
      case 'em':
      case 'li':
        return element.content || elementConfig.defaultContent;
      
      default:
        // Для контейнерів (div, section, nav, header, footer, etc.)
        if (canHaveChildren) {
          return (
            <>
              {/* Контент самого елемента, якщо є */}
              {element.content && (
                <div style={{ marginBottom: children.length > 0 ? '8px' : '0' }}>
                  {element.content}
                </div>
              )}
              
              {/* Дочірні елементи */}
              {children.map(child => (
                <CanvasElement
                  key={child.id}
                  element={child}
                  elements={elements}
                  isSelected={isSelected}
                  onSelect={onSelect}
                  onUpdate={onUpdate}
                  level={level + 1}
                />
              ))}
              
              {/* Placeholder для пустих контейнерів */}
              {children.length === 0 && (
                <div className="empty-container-placeholder">
                  <span>Пустий {elementConfig.label.toLowerCase()}</span>
                  <small>Клікніть на елемент в панелі інструментів щоб додати сюди</small>
                </div>
              )}
            </>
          );
        }
        
        return element.content || elementConfig.defaultContent;
    }
  };

  const elementStyle = {
    ...element.styles,
    position: 'relative',
    boxSizing: 'border-box',
    // Мінімальна висота для контейнерів
    minHeight: canHaveChildren && children.length === 0 ? '60px' : 'auto',
  };

  return (
    <div
      ref={ref}
      className={`canvas-element ${isSelected ? 'selected' : ''}`}
      style={elementStyle}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      data-element-type={element.type}
      data-level={level}
    >
      {isSelected && (
        <div className="element-overlay">
          <div className="element-label">
            {element.type}
            {element.className && ` .${element.className}`}
            {level > 0 && ` (рівень ${level})`}
          </div>
        </div>
      )}
      
      {renderContent()}
    </div>
  );
};

export default CanvasElement;