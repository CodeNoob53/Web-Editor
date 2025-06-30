import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  Eye, 
  EyeOff, 
  Trash2,
  Square,
  Type,
  Image,
  MousePointer,
  FormInput,
  Navigation,
  Layout,
  FileText
} from 'lucide-react';
import './DOMTree.css';

const ELEMENT_ICONS = {
  div: Square,
  text: Type,
  button: MousePointer,
  img: Image,
  input: FormInput,
  section: Layout,
  nav: Navigation,
  article: FileText
};

const TreeNode = ({ 
  element, 
  elements, 
  selectedElement, 
  onSelectElement, 
  onDeleteElement,
  onUpdateElement,
  level = 0 
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const children = elements.filter(el => el.parentId === element.id);
  const hasChildren = children.length > 0;
  const isSelected = selectedElement === element.id;
  const isVisible = element.styles?.display !== 'none';
  
  const Icon = ELEMENT_ICONS[element.type] || Square;

  const handleToggleExpand = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleToggleVisibility = (e) => {
    e.stopPropagation();
    const newDisplay = isVisible ? 'none' : (element.styles?.display || 'flex');
    onUpdateElement(element.id, {
      styles: {
        ...element.styles,
        display: newDisplay
      }
    });
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (confirm('Видалити цей елемент та всі його дочірні елементи?')) {
      onDeleteElement(element.id);
    }
  };

  const handleSelect = () => {
    onSelectElement(element.id);
  };

  return (
    <div className="tree-node">
      <div 
        className={`tree-node-content ${isSelected ? 'selected' : ''} ${!isVisible ? 'hidden' : ''}`}
        style={{ paddingLeft: `${level * 20 + 12}px` }}
        onClick={handleSelect}
      >
        <div className="tree-node-expand">
          {hasChildren && (
            <button 
              className="expand-button"
              onClick={handleToggleExpand}
            >
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          )}
        </div>

        <div className="tree-node-icon">
          <Icon size={16} />
        </div>

        <div className="tree-node-info">
          <span className="tree-node-type">{element.type}</span>
          {element.className && (
            <span className="tree-node-class">.{element.className}</span>
          )}
          {element.content && element.type !== 'img' && (
            <span className="tree-node-content-preview">
              "{element.content.slice(0, 20)}{element.content.length > 20 ? '...' : ''}"
            </span>
          )}
          {hasChildren && (
            <span className="tree-node-children-count">({children.length})</span>
          )}
        </div>

        <div className="tree-node-actions">
          <button 
            className="action-button"
            onClick={handleToggleVisibility}
            title={isVisible ? 'Сховати' : 'Показати'}
          >
            {isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>
          <button 
            className="action-button delete"
            onClick={handleDelete}
            title="Видалити"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div className="tree-node-children">
          {children.map(child => (
            <TreeNode
              key={child.id}
              element={child}
              elements={elements}
              selectedElement={selectedElement}
              onSelectElement={onSelectElement}
              onDeleteElement={onDeleteElement}
              onUpdateElement={onUpdateElement}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const DOMTree = ({ 
  elements, 
  selectedElement, 
  onSelectElement, 
  onDeleteElement,
  onUpdateElement 
}) => {
  const rootElements = elements.filter(el => !el.parentId);

  return (
    <div className="dom-tree">
      <div className="dom-tree-header">
        <h3>Структура</h3>
        <div className="tree-stats">
          {elements.length} елементів
        </div>
      </div>

      <div className="dom-tree-content">
        {rootElements.length === 0 ? (
          <div className="tree-empty">
            <div className="empty-icon">🌳</div>
            <p>Структура порожня</p>
            <span>Додайте елементи на полотно</span>
          </div>
        ) : (
          <div className="tree-nodes">
            {rootElements.map(element => (
              <TreeNode
                key={element.id}
                element={element}
                elements={elements}
                selectedElement={selectedElement}
                onSelectElement={onSelectElement}
                onDeleteElement={onDeleteElement}
                onUpdateElement={onUpdateElement}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DOMTree;