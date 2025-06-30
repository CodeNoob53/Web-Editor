import React from 'react';
import CanvasElement from './CanvasElement';
import './EditorCanvas.css';

const EditorCanvas = ({
  elements,
  selectedElement,
  onSelectElement,
  onUpdateElement,
  showGrid,
  zoom
}) => {
  const rootElements = elements.filter(el => !el.parentId);

  const handleCanvasClick = (e) => {
    // Клік по пустому місцю canvas - знімаємо виділення
    if (e.target === e.currentTarget || 
        e.target.classList.contains('canvas-content') ||
        e.target.classList.contains('canvas')) {
      onSelectElement(null);
    }
  };

  // Обчислюємо розміри для правильного масштабування
  const canvasStyle = {
    transform: `scale(${zoom / 100})`,
    transformOrigin: 'top left',
  };

  return (
    <div className="canvas-wrapper">
      <div className="canvas-toolbar">
        <div className="canvas-info">
          <span>Полотно</span>
          <span className="element-count">{elements.length} елементів</span>
        </div>
        <div className="canvas-info">
          <span>Масштаб: {zoom}%</span>
        </div>
      </div>
      
      <div 
        className={`canvas ${showGrid ? 'show-grid' : ''}`}
        style={canvasStyle}
        onClick={handleCanvasClick}
      >
        <div className="canvas-content">
          {rootElements.length === 0 ? (
            <div className="canvas-placeholder">
              <div className="placeholder-icon">📐</div>
              <h3>Почніть створювати</h3>
              <p>Виберіть контейнер і клікніть на елемент в панелі інструментів</p>
            </div>
          ) : (
            <>
              {rootElements.map((element) => (
                <CanvasElement
                  key={element.id}
                  element={element}
                  elements={elements}
                  isSelected={selectedElement === element.id}
                  onSelect={onSelectElement}
                  onUpdate={onUpdateElement}
                  level={0}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorCanvas;