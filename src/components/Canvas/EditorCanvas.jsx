import React from 'react';
import { useDrop } from 'react-dnd';
import CanvasElement from './CanvasElement';
import './EditorCanvas.css';

const EditorCanvas = ({
  elements,
  selectedElement,
  onSelectElement,
  onUpdateElement,
  onAddElement,
  onMoveElement,
  showGrid,
  zoom
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ['ELEMENT', 'CANVAS_ELEMENT'],
    drop: (item, monitor) => {
      if (!monitor.didDrop()) {
        if (item.elementType) {
          // Новий елемент з toolbox
          return { parentId: null, index: 0 };
        } else if (item.id) {
          // Переміщення існуючого елемента на root рівень
          const rootElements = elements.filter(el => !el.parentId);
          onMoveElement(item.id, null, rootElements.length);
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  }));

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
    // Не встановлюємо фіксовані розміри - дозволяємо canvas адаптуватися
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
        ref={drop}
        className={`canvas ${showGrid ? 'show-grid' : ''} ${isOver ? 'drag-over' : ''}`}
        style={canvasStyle}
        onClick={handleCanvasClick}
      >
        <div className="canvas-content">
          {rootElements.length === 0 ? (
            <div className="canvas-placeholder">
              <div className="placeholder-icon">📐</div>
              <h3>Почніть створювати</h3>
              <p>Перетягніть елементи з панелі інструментів або клікніть на них</p>
            </div>
          ) : (
            <>
              {rootElements.map((element, index) => (
                <CanvasElement
                  key={element.id}
                  element={element}
                  elements={elements}
                  isSelected={selectedElement === element.id}
                  onSelect={onSelectElement}
                  onUpdate={onUpdateElement}
                  onAddElement={onAddElement}
                  onMove={onMoveElement}
                  index={index}
                />
              ))}
            </>
          )}
          
          {/* Drop zone indicator коли перетягуємо */}
          {isOver && rootElements.length > 0 && (
            <div style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              right: '20px',
              height: '60px',
              border: '2px dashed #007AFF',
              borderRadius: '8px',
              backgroundColor: 'rgba(0, 122, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#007AFF',
              fontWeight: '500',
              pointerEvents: 'none',
              zIndex: 10
            }}>
              Відпустіть тут щоб додати в кінець
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorCanvas;