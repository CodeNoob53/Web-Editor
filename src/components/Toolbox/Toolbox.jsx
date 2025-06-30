import React from 'react';
import { useDrag } from 'react-dnd';
import { 
  Square, 
  Type, 
  Image, 
  MousePointer, 
  FormInput,
  Navigation,
  Layout,
  FileText
} from 'lucide-react';
import './Toolbox.css';

const ELEMENT_TYPES = [
  { type: 'div', label: 'Контейнер', icon: Square, description: 'Базовий блок' },
  { type: 'text', label: 'Текст', icon: Type, description: 'Текстовий елемент' },
  { type: 'button', label: 'Кнопка', icon: MousePointer, description: 'Інтерактивна кнопка' },
  { type: 'img', label: 'Зображення', icon: Image, description: 'Картинка' },
  { type: 'input', label: 'Поле вводу', icon: FormInput, description: 'Текстове поле' },
  { type: 'section', label: 'Секція', icon: Layout, description: 'Семантична секція' },
  { type: 'nav', label: 'Навігація', icon: Navigation, description: 'Меню навігації' },
  { type: 'article', label: 'Стаття', icon: FileText, description: 'Контентний блок' }
];

const DraggableElement = ({ elementType, onAddElement }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'ELEMENT',
    item: { elementType },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        onAddElement(item.elementType, dropResult.parentId);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const element = ELEMENT_TYPES.find(el => el.type === elementType);
  const Icon = element.icon;

  return (
    <div
      ref={drag}
      className={`toolbox-item ${isDragging ? 'dragging' : ''}`}
      onClick={() => onAddElement(elementType)}
      title={element.description}
    >
      <div className="toolbox-item-icon">
        <Icon size={20} />
      </div>
      <div className="toolbox-item-content">
        <div className="toolbox-item-label">{element.label}</div>
        <div className="toolbox-item-description">{element.description}</div>
      </div>
    </div>
  );
};

const Toolbox = ({ onAddElement }) => {
  return (
    <div className="toolbox">
      <div className="toolbox-header">
        <h3>Елементи</h3>
        <div className="toolbox-subtitle">Перетягніть або клікніть</div>
      </div>
      
      <div className="toolbox-content">
        <div className="toolbox-section">
          <div className="toolbox-section-title">Базові</div>
          <div className="toolbox-items">
            {ELEMENT_TYPES.slice(0, 4).map(element => (
              <DraggableElement
                key={element.type}
                elementType={element.type}
                onAddElement={onAddElement}
              />
            ))}
          </div>
        </div>

        <div className="toolbox-section">
          <div className="toolbox-section-title">Форми</div>
          <div className="toolbox-items">
            {ELEMENT_TYPES.slice(4, 5).map(element => (
              <DraggableElement
                key={element.type}
                elementType={element.type}
                onAddElement={onAddElement}
              />
            ))}
          </div>
        </div>

        <div className="toolbox-section">
          <div className="toolbox-section-title">Семантичні</div>
          <div className="toolbox-items">
            {ELEMENT_TYPES.slice(5).map(element => (
              <DraggableElement
                key={element.type}
                elementType={element.type}
                onAddElement={onAddElement}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toolbox;