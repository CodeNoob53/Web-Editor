import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

const LayoutControls = ({ element, onUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleStyleChange = (property, value) => {
    onUpdate(element.id, {
      styles: {
        ...element.styles,
        [property]: value
      }
    });
  };

  const displayOptions = [
    { value: 'flex', label: 'Flex' },
    { value: 'block', label: 'Block' },
    { value: 'inline', label: 'Inline' },
    { value: 'inline-block', label: 'Inline Block' },
    { value: 'grid', label: 'Grid' },
    { value: 'none', label: 'None' }
  ];

  const positionOptions = [
    { value: 'static', label: 'Static' },
    { value: 'relative', label: 'Relative' },
    { value: 'absolute', label: 'Absolute' },
    { value: 'fixed', label: 'Fixed' },
    { value: 'sticky', label: 'Sticky' }
  ];

  const flexDirectionOptions = [
    { value: 'row', label: 'Горизонтально' },
    { value: 'column', label: 'Вертикально' },
    { value: 'row-reverse', label: 'Горизонтально (реверс)' },
    { value: 'column-reverse', label: 'Вертикально (реверс)' }
  ];

  const justifyContentOptions = [
    { value: 'flex-start', label: 'Початок' },
    { value: 'center', label: 'Центр' },
    { value: 'flex-end', label: 'Кінець' },
    { value: 'space-between', label: 'Між елементами' },
    { value: 'space-around', label: 'Навколо елементів' },
    { value: 'space-evenly', label: 'Рівномірно' }
  ];

  const alignItemsOptions = [
    { value: 'stretch', label: 'Розтягнути' },
    { value: 'flex-start', label: 'Початок' },
    { value: 'center', label: 'Центр' },
    { value: 'flex-end', label: 'Кінець' },
    { value: 'baseline', label: 'Базова лінія' }
  ];

  return (
    <div className="settings-section">
      <div 
        className="settings-section-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="settings-section-title">Макет і Позиція</span>
        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </div>
      
      {isExpanded && (
        <div className="settings-section-content">
          <div className="control-group">
            <label className="control-label">Display</label>
            <select
              className="control-input"
              value={element.styles.display || 'flex'}
              onChange={(e) => handleStyleChange('display', e.target.value)}
            >
              {displayOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label className="control-label">Position</label>
            <select
              className="control-input"
              value={element.styles.position || 'static'}
              onChange={(e) => handleStyleChange('position', e.target.value)}
            >
              {positionOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Position coordinates */}
          {element.styles.position && element.styles.position !== 'static' && (
            <div className="control-group">
              <label className="control-label">Координати (px)</label>
              <div className="control-row">
                <div className="control-group">
                  <label className="control-label-small">Top</label>
                  <input
                    type="number"
                    className="control-input"
                    value={parseInt(element.styles.top) || 0}
                    onChange={(e) => handleStyleChange('top', `${e.target.value}px`)}
                  />
                </div>
                <div className="control-group">
                  <label className="control-label-small">Right</label>
                  <input
                    type="number"
                    className="control-input"
                    value={parseInt(element.styles.right) || 0}
                    onChange={(e) => handleStyleChange('right', `${e.target.value}px`)}
                  />
                </div>
                <div className="control-group">
                  <label className="control-label-small">Bottom</label>
                  <input
                    type="number"
                    className="control-input"
                    value={parseInt(element.styles.bottom) || 0}
                    onChange={(e) => handleStyleChange('bottom', `${e.target.value}px`)}
                  />
                </div>
                <div className="control-group">
                  <label className="control-label-small">Left</label>
                  <input
                    type="number"
                    className="control-input"
                    value={parseInt(element.styles.left) || 0}
                    onChange={(e) => handleStyleChange('left', `${e.target.value}px`)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Dimensions */}
          <div className="control-group">
            <label className="control-label">Розміри</label>
            <div className="control-row">
              <div className="control-group">
                <label className="control-label-small">Ширина</label>
                <input
                  type="text"
                  className="control-input"
                  value={element.styles.width || 'auto'}
                  onChange={(e) => handleStyleChange('width', e.target.value)}
                  placeholder="auto, 100px, 50%"
                />
              </div>
              <div className="control-group">
                <label className="control-label-small">Висота</label>
                <input
                  type="text"
                  className="control-input"
                  value={element.styles.height || 'auto'}
                  onChange={(e) => handleStyleChange('height', e.target.value)}
                  placeholder="auto, 100px, 50%"
                />
              </div>
            </div>
          </div>

          <div className="control-row">
            <div className="control-group">
              <label className="control-label">Min Width</label>
              <input
                type="text"
                className="control-input"
                value={element.styles.minWidth || '0px'}
                onChange={(e) => handleStyleChange('minWidth', e.target.value)}
                placeholder="0px, 100px, 50%"
              />
            </div>
            <div className="control-group">
              <label className="control-label">Min Height</label>
              <input
                type="text"
                className="control-input"
                value={element.styles.minHeight || '0px'}
                onChange={(e) => handleStyleChange('minHeight', e.target.value)}
                placeholder="0px, 100px, 50%"
              />
            </div>
          </div>

          <div className="control-row">
            <div className="control-group">
              <label className="control-label">Max Width</label>
              <input
                type="text"
                className="control-input"
                value={element.styles.maxWidth || 'none'}
                onChange={(e) => handleStyleChange('maxWidth', e.target.value)}
                placeholder="none, 100px, 50%"
              />
            </div>
            <div className="control-group">
              <label className="control-label">Max Height</label>
              <input
                type="text"
                className="control-input"
                value={element.styles.maxHeight || 'none'}
                onChange={(e) => handleStyleChange('maxHeight', e.target.value)}
                placeholder="none, 100px, 50%"
              />
            </div>
          </div>

          {element.styles.display === 'flex' && (
            <>
              <div className="control-group">
                <label className="control-label">Напрямок</label>
                <select
                  className="control-input"
                  value={element.styles.flexDirection || 'column'}
                  onChange={(e) => handleStyleChange('flexDirection', e.target.value)}
                >
                  {flexDirectionOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="control-group">
                <label className="control-label">Вирівнювання (головна вісь)</label>
                <select
                  className="control-input"
                  value={element.styles.justifyContent || 'flex-start'}
                  onChange={(e) => handleStyleChange('justifyContent', e.target.value)}
                >
                  {justifyContentOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="control-group">
                <label className="control-label">Вирівнювання (поперечна вісь)</label>
                <select
                  className="control-input"
                  value={element.styles.alignItems || 'stretch'}
                  onChange={(e) => handleStyleChange('alignItems', e.target.value)}
                >
                  {alignItemsOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="control-row">
                <div className="control-group">
                  <label className="control-label">Gap</label>
                  <input
                    type="number"
                    className="control-input"
                    value={parseInt(element.styles.gap) || 0}
                    onChange={(e) => handleStyleChange('gap', `${e.target.value}px`)}
                    min="0"
                  />
                </div>
              </div>
            </>
          )}

          {/* Z-Index */}
          <div className="control-group">
            <label className="control-label">Z-Index</label>
            <input
              type="number"
              className="control-input"
              value={parseInt(element.styles.zIndex) || 0}
              onChange={(e) => handleStyleChange('zIndex', e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LayoutControls;