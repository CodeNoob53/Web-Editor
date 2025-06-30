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
    accept: 'ELEMENT',
    drop: (item, monitor) => {
      if (!monitor.didDrop()) {
        return { parentId: null };
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  }));

  const rootElements = elements.filter(el => !el.parentId);

  const handleCanvasClick = (e) => {
    if (e.target === e.currentTarget || e.target.classList.contains('canvas-content')) {
      onSelectElement(null);
    }
  };

  return (
    <div className="canvas-wrapper">
      <div className="canvas-toolbar">
        <div className="canvas-info">
          <span>Полотно</span>
          <span className="element-count">{elements.length} елементів</span>
        </div>
      </div>
      
      <div 
        ref={drop}
        className={`canvas ${showGrid ? 'show-grid' : ''} ${isOver ? 'drag-over' : ''}`}
        style={{ 
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'top left',
          width: `${10000 / zoom * 100}px`,
          height: `${10000 / zoom * 100}px`
        }}
        onClick={handleCanvasClick}
      >
        <div className="canvas-content" style={{ minHeight: '100vh', position: 'relative' }}>
          {rootElements.length === 0 ? (
            <div className="canvas-placeholder">
              <div className="placeholder-icon">📐</div>
              <h3>Почніть створювати</h3>
              <p>Перетягніть елементи з панелі інструментів або клікніть на них</p>
            </div>
          ) : (
            rootElements.map(element => (
              <CanvasElement
                key={element.id}
                element={element}
                elements={elements}
                isSelected={selectedElement === element.id}
                onSelect={onSelectElement}
                onUpdate={onUpdateElement}
                onAddElement={onAddElement}
                onMove={onMoveElement}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorCanvas;