import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
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
import { HTML_ELEMENTS } from '../../config/htmlElements';
import './DOMTree.css';

const ELEMENT_ICONS = {
  div: Square,
  section: Layout,
  nav: Navigation,
  header: Layout,
  footer: Layout,
  article: FileText,
  aside: Layout,
  main: Layout,
  h1: Type,
  h2: Type,
  h3: Type,
  p: Type,
  span: Type,
  strong: Type,
  em: Type,
  button: MousePointer,
  a: MousePointer,
  img: Image,
  input: FormInput,
  textarea: FormInput,
  select: FormInput,
  option: FormInput,
  ul: Layout,
  ol: Layout,
  li: Type
};

const TreeNode = ({ 
  element, 
  elements, 
  selectedElement, 
  onSelectElement, 
  onDeleteElement,
  onUpdateElement,
  onMoveElement,
  level = 0 
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [dropPosition, setDropPosition] = useState(null); // 'before', 'after', 'inside'
  
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TREE_ELEMENT',
    item: { id: element.id, type: element.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'TREE_ELEMENT',
    hover: (item, monitor) => {
      if (item.id === element.id) return;
      
      const clientOffset = monitor.getClientOffset();
      const targetRect = monitor.getDropTargetMonitor().getTargetBoundingRect();
      
      if (clientOffset && targetRect) {
        const hoverMiddleY = (targetRect.bottom - targetRect.top) / 2;
        const hoverClientY = clientOffset.y - targetRect.top;
        
        const elementConfig = HTML_ELEMENTS[element.type];
        const canHaveChildren = elementConfig?.canHaveChildren;
        
        if (canHaveChildren) {
          const topThreshold = hoverMiddleY * 0.25;
          const bottomThreshold = hoverMiddleY * 1.75;
          
          if (hoverClientY < topThreshold) {
            setDropPosition('before');
          } else if (hoverClientY > bottomThreshold) {
            setDropPosition('after');
          } else {
            setDropPosition('inside');
          }
        } else {
          if (hoverClientY < hoverMiddleY) {
            setDropPosition('before');
          } else {
            setDropPosition('after');
          }
        }
      }
    },
    drop: (item, monitor) => {
      if (!monitor.didDrop() && item.id !== element.id) {
        const siblings = elements.filter(el => el.parentId === element.parentId);
        const currentIndex = siblings.findIndex(el => el.id === element.id);
        
        if (dropPosition === 'inside') {
          const elementConfig = HTML_ELEMENTS[element.type];
          if (elementConfig?.canHaveChildren) {
            const children = elements.filter(el => el.parentId === element.id);
            onMoveElement(item.id, element.id, children.length);
          }
        } else if (dropPosition === 'before') {
          onMoveElement(item.id, element.parentId, currentIndex);
        } else if (dropPosition === 'after') {
          onMoveElement(item.id, element.parentId, currentIndex + 1);
        }
      }
      setDropPosition(null);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  }));
  
  React.useEffect(() => {
    if (!isOver) {
      setDropPosition(null);
    }
  }, [isOver]);
  
  const children = elements.filter(el => el.parentId === element.id);
  const hasChildren = children.length > 0;
  const isSelected = selectedElement === element.id;
  const isVisible = element.styles?.display !== 'none';
  const elementConfig = HTML_ELEMENTS[element.type];
  
  const Icon = ELEMENT_ICONS[element.type] || Square;

  // Combine drag and drop refs
  const ref = React.useRef(null);
  drag(drop(ref));

  const handleToggleExpand = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleToggleVisibility = (e) => {
    e.stopPropagation();
    const newDisplay = isVisible ? 'none' : (elementConfig?.defaultStyles?.display || 'block');
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

  const getDropIndicatorStyle = () => {
    if (!isOver || !dropPosition) return null;
    
    const baseStyle = {
      position: 'absolute',
      left: `${level * 20 + 8}px`,
      right: '8px',
      height: '2px',
      backgroundColor: '#007AFF',
      zIndex: 1000,
      pointerEvents: 'none'
    };
    
    if (dropPosition === 'before') {
      return { ...baseStyle, top: '0px' };
    } else if (dropPosition === 'after') {
      return { ...baseStyle, bottom: '0px' };
    } else if (dropPosition === 'inside') {
      return {
        position: 'absolute',
        left: `${level * 20 + 8}px`,
        right: '8px',
        top: '2px',
        bottom: '2px',
        backgroundColor: 'rgba(0, 122, 255, 0.1)',
        border: '1px dashed #007AFF',
        borderRadius: '3px',
        zIndex: 1000,
        pointerEvents: 'none'
      };
    }
    
    return null;
  };

  const dropIndicatorStyle = getDropIndicatorStyle();

  return (
    <div className={`tree-node ${isDragging ? 'dragging' : ''}`} style={{ position: 'relative' }}>
      {/* Drop indicator */}
      {dropIndicatorStyle && <div style={dropIndicatorStyle} />}
      
      <div 
        ref={ref}
        className={`tree-node-content ${isSelected ? 'selected' : ''} ${!isVisible ? 'hidden' : ''} group`}
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
          {element.content && !elementConfig?.canHaveChildren && (
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
              onMoveElement={onMoveElement}
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
  onUpdateElement,
  onMoveElement 
}) => {
  const rootElements = elements.filter(el => !el.parentId);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'TREE_ELEMENT',
    drop: (item, monitor) => {
      if (!monitor.didDrop()) {
        // Переміщуємо на root рівень
        const rootElements = elements.filter(el => !el.parentId);
        onMoveElement(item.id, null, rootElements.length);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  }));

  return (
    <div className="dom-tree">
      <div className="dom-tree-header">
        <h3>Структура</h3>
        <div className="tree-stats">
          {elements.length} елементів
        </div>
      </div>

      <div ref={drop} className="dom-tree-content" style={{ position: 'relative' }}>
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
                onMoveElement={onMoveElement}
              />
            ))}
            
            {/* Drop zone для root рівня */}
            {isOver && (
              <div style={{
                height: '3px',
                backgroundColor: '#007AFF',
                margin: '4px 8px',
                borderRadius: '2px'
              }} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DOMTree;