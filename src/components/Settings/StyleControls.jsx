import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

const StyleControls = ({ element, onUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleStyleChange = (property, value) => {
    onUpdate(element.id, {
      styles: {
        ...element.styles,
        [property]: value
      }
    });
  };

  return (
    <div className="settings-section">
      <div 
        className="settings-section-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="settings-section-title">Стилі</span>
        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </div>
      
      {isExpanded && (
        <div className="settings-section-content">
          {/* Spacing */}
          <div className="control-group">
            <label className="control-label">Відступи (Padding)</label>
            <div className="control-row">
              <input
                type="number"
                className="control-input"
                value={parseInt(element.styles.paddingTop) || parseInt(element.styles.padding) || 0}
                onChange={(e) => handleStyleChange('paddingTop', `${e.target.value}px`)}
                placeholder="Верх"
                min="0"
              />
              <input
                type="number"
                className="control-input"
                value={parseInt(element.styles.paddingRight) || parseInt(element.styles.padding) || 0}
                onChange={(e) => handleStyleChange('paddingRight', `${e.target.value}px`)}
                placeholder="Право"
                min="0"
              />
              <input
                type="number"
                className="control-input"
                value={parseInt(element.styles.paddingBottom) || parseInt(element.styles.padding) || 0}
                onChange={(e) => handleStyleChange('paddingBottom', `${e.target.value}px`)}
                placeholder="Низ"
                min="0"
              />
              <input
                type="number"
                className="control-input"
                value={parseInt(element.styles.paddingLeft) || parseInt(element.styles.padding) || 0}
                onChange={(e) => handleStyleChange('paddingLeft', `${e.target.value}px`)}
                placeholder="Ліво"
                min="0"
              />
            </div>
          </div>

          <div className="control-group">
            <label className="control-label">Зовнішні відступи (Margin)</label>
            <div className="control-row">
              <input
                type="number"
                className="control-input"
                value={parseInt(element.styles.marginTop) || parseInt(element.styles.margin) || 0}
                onChange={(e) => handleStyleChange('marginTop', `${e.target.value}px`)}
                placeholder="Верх"
              />
              <input
                type="number"
                className="control-input"
                value={parseInt(element.styles.marginRight) || parseInt(element.styles.margin) || 0}
                onChange={(e) => handleStyleChange('marginRight', `${e.target.value}px`)}
                placeholder="Право"
              />
              <input
                type="number"
                className="control-input"
                value={parseInt(element.styles.marginBottom) || parseInt(element.styles.margin) || 0}
                onChange={(e) => handleStyleChange('marginBottom', `${e.target.value}px`)}
                placeholder="Низ"
              />
              <input
                type="number"
                className="control-input"
                value={parseInt(element.styles.marginLeft) || parseInt(element.styles.margin) || 0}
                onChange={(e) => handleStyleChange('marginLeft', `${e.target.value}px`)}
                placeholder="Ліво"
              />
            </div>
          </div>

          {/* Colors */}
          <div className="control-row">
            <div className="control-group">
              <label className="control-label">Колір фону</label>
              <input
                type="color"
                className="control-input"
                value={element.styles.backgroundColor === 'transparent' ? '#ffffff' : element.styles.backgroundColor || '#ffffff'}
                onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
              />
            </div>
            <div className="control-group">
              <label className="control-label">Колір тексту</label>
              <input
                type="color"
                className="control-input"
                value={element.styles.color || '#1d1d1f'}
                onChange={(e) => handleStyleChange('color', e.target.value)}
              />
            </div>
          </div>

          {/* Border */}
          <div className="control-group">
            <label className="control-label">Рамка</label>
            <div className="control-row">
              <input
                type="number"
                className="control-input"
                value={parseInt(element.styles.borderWidth) || 0}
                onChange={(e) => handleStyleChange('borderWidth', `${e.target.value}px`)}
                placeholder="Товщина"
                min="0"
              />
              <select
                className="control-input"
                value={element.styles.borderStyle || 'solid'}
                onChange={(e) => handleStyleChange('borderStyle', e.target.value)}
              >
                <option value="solid">Суцільна</option>
                <option value="dashed">Пунктирна</option>
                <option value="dotted">Крапкова</option>
                <option value="none">Немає</option>
              </select>
              <input
                type="color"
                className="control-input"
                value={element.styles.borderColor || '#d1d1d6'}
                onChange={(e) => handleStyleChange('borderColor', e.target.value)}
              />
            </div>
          </div>

          <div className="control-group">
            <label className="control-label">Заокруглення кутів</label>
            <input
              type="number"
              className="control-input"
              value={parseInt(element.styles.borderRadius) || 0}
              onChange={(e) => handleStyleChange('borderRadius', `${e.target.value}px`)}
              min="0"
            />
          </div>

          {/* Typography */}
          {(element.type === 'text' || element.type === 'button') && (
            <>
              <div className="control-row">
                <div className="control-group">
                  <label className="control-label">Розмір шрифту</label>
                  <input
                    type="number"
                    className="control-input"
                    value={parseInt(element.styles.fontSize) || 16}
                    onChange={(e) => handleStyleChange('fontSize', `${e.target.value}px`)}
                    min="8"
                    max="72"
                  />
                </div>
                <div className="control-group">
                  <label className="control-label">Вага шрифту</label>
                  <select
                    className="control-input"
                    value={element.styles.fontWeight || 'normal'}
                    onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
                  >
                    <option value="normal">Звичайний</option>
                    <option value="500">Середній</option>
                    <option value="600">Напівжирний</option>
                    <option value="bold">Жирний</option>
                  </select>
                </div>
              </div>

              <div className="control-group">
                <label className="control-label">Вирівнювання тексту</label>
                <select
                  className="control-input"
                  value={element.styles.textAlign || 'left'}
                  onChange={(e) => handleStyleChange('textAlign', e.target.value)}
                >
                  <option value="left">Ліворуч</option>
                  <option value="center">По центру</option>
                  <option value="right">Праворуч</option>
                  <option value="justify">По ширині</option>
                </select>
              </div>
            </>
          )}

          {/* Shadow */}
          <div className="control-group">
            <label className="control-label">Тінь</label>
            <input
              type="text"
              className="control-input"
              value={element.styles.boxShadow || ''}
              onChange={(e) => handleStyleChange('boxShadow', e.target.value)}
              placeholder="0 2px 4px rgba(0,0,0,0.1)"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StyleControls;