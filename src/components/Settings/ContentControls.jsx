import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

const ContentControls = ({ element, onUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleContentChange = (field, value) => {
    if (field === 'content') {
      onUpdate(element.id, { content: value });
    } else {
      onUpdate(element.id, { [field]: value });
    }
  };

  return (
    <div className="settings-section">
      <div 
        className="settings-section-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="settings-section-title">Контент</span>
        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </div>
      
      {isExpanded && (
        <div className="settings-section-content">
          <div className="control-group">
            <label className="control-label">CSS Клас</label>
            <input
              type="text"
              className="control-input"
              value={element.className || ''}
              onChange={(e) => handleContentChange('className', e.target.value)}
              placeholder="element-class"
            />
          </div>

          {(element.type === 'text' || element.type === 'button') && (
            <div className="control-group">
              <label className="control-label">Текст</label>
              <textarea
                className="control-input"
                value={element.content || ''}
                onChange={(e) => handleContentChange('content', e.target.value)}
                placeholder="Введіть текст"
                rows={3}
                style={{ resize: 'vertical', minHeight: '80px' }}
              />
            </div>
          )}

          {element.type === 'img' && (
            <div className="control-group">
              <label className="control-label">URL зображення</label>
              <input
                type="url"
                className="control-input"
                value={element.content || ''}
                onChange={(e) => handleContentChange('content', e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          )}

          {element.type === 'input' && (
            <div className="control-group">
              <label className="control-label">Placeholder</label>
              <input
                type="text"
                className="control-input"
                value={element.content || ''}
                onChange={(e) => handleContentChange('content', e.target.value)}
                placeholder="Введіть placeholder"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ContentControls;