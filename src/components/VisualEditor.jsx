import React, { useState, useCallback } from 'react';
import TopBar from './TopBar/TopBar';
import Toolbox from './Toolbox/Toolbox';
import EditorCanvas from './Canvas/EditorCanvas';
import SettingsPanel from './Settings/SettingsPanel';
import DOMTree from './DOMTree/DOMTree';
import { HTML_ELEMENTS } from '../config/htmlElements';
import { v4 as uuidv4 } from 'uuid';
import './VisualEditor.css';

const VisualEditor = () => {
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [canvasZoom, setCanvasZoom] = useState(100);

  const addElement = useCallback((elementType, parentId = null, index = null) => {
    const elementConfig = HTML_ELEMENTS[elementType];
    if (!elementConfig) {
      console.warn(`Element type ${elementType} not found in configuration`);
      return;
    }

    // Визначаємо куди додавати елемент
    let targetParentId = parentId;
    
    // Якщо parentId не вказаний, перевіряємо чи є активний елемент
    if (!targetParentId && selectedElement) {
      const selectedElementData = elements.find(el => el.id === selectedElement);
      const selectedConfig = selectedElementData ? HTML_ELEMENTS[selectedElementData.type] : null;
      
      // Якщо обраний елемент може мати дітей, додаємо в нього
      if (selectedConfig?.canHaveChildren) {
        targetParentId = selectedElement;
      }
    }

    // Визначаємо індекс для вставки
    if (index === null) {
      const siblings = elements.filter(el => el.parentId === targetParentId);
      index = siblings.length;
    }

    const newElement = {
      id: uuidv4(),
      type: elementType,
      parentId: targetParentId,
      styles: { ...elementConfig.defaultStyles },
      content: elementConfig.defaultContent,
      attributes: elementConfig.defaultAttributes ? { ...elementConfig.defaultAttributes } : {},
      className: generateBEMClass(elementType)
    };

    setElements(prev => [...prev, newElement]);
    setSelectedElement(newElement.id);
  }, [elements, selectedElement]);

  const updateElement = useCallback((elementId, updates) => {
    setElements(prev => 
      prev.map(el => 
        el.id === elementId 
          ? { ...el, ...updates }
          : el
      )
    );
  }, []);

  const deleteElement = useCallback((elementId) => {
    setElements(prev => {
      // Рекурсивно видаляємо елемент та всіх його дітей
      const toRemove = new Set([elementId]);
      const findChildren = (id) => {
        prev.forEach(el => {
          if (el.parentId === id) {
            toRemove.add(el.id);
            findChildren(el.id);
          }
        });
      };
      findChildren(elementId);

      return prev.filter(el => !toRemove.has(el.id));
    });

    if (selectedElement === elementId) {
      setSelectedElement(null);
    }
  }, [selectedElement]);

  const moveElement = useCallback((elementId, newParentId) => {
    setElements(prev => {
      const element = prev.find(el => el.id === elementId);
      if (!element) return prev;

      // Перевіряємо чи не намагаємося перемістити елемент в себе або в свого нащадка
      const isDescendant = (parentId, targetId) => {
        if (!parentId) return false;
        const parent = prev.find(el => el.id === parentId);
        if (!parent) return false;
        if (parent.id === targetId) return true;
        return parent.parentId ? isDescendant(parent.parentId, targetId) : false;
      };

      if (newParentId && isDescendant(newParentId, elementId)) {
        console.warn('Cannot move element into its descendant');
        return prev;
      }

      // Оновлюємо елемент
      return prev.map(el => 
        el.id === elementId 
          ? { ...el, parentId: newParentId }
          : el
      );
    });
  }, []);

  const exportProject = useCallback(() => {
    const html = generateHTML(elements);
    const css = generateCSS(elements);
    
    const htmlContent = `<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Page</title>
    <style>
        /* Reset */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.5;
        }
        
        /* Generated styles */
${css}
    </style>
</head>
<body>
${html}
</body>
</html>`;

    downloadFile('index.html', htmlContent);
  }, [elements]);

  const selectedElementData = selectedElement 
    ? elements.find(el => el.id === selectedElement)
    : null;

  return (
    <div className={`visual-editor ${isDarkMode ? 'dark' : ''}`}>
      <TopBar 
        onExport={exportProject}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        showGrid={showGrid}
        onToggleGrid={() => setShowGrid(!showGrid)}
        zoom={canvasZoom}
        onZoomChange={setCanvasZoom}
      />
      
      <div className="editor-content">
        <Toolbox 
          onAddElement={addElement}
          selectedElement={selectedElementData}
        />
        
        <div className="canvas-container">
          <EditorCanvas
            elements={elements}
            selectedElement={selectedElement}
            onSelectElement={setSelectedElement}
            onUpdateElement={updateElement}
            onAddElement={addElement}
            onMoveElement={moveElement}
            showGrid={showGrid}
            zoom={canvasZoom}
          />
        </div>

        <div className="right-panel">
          <DOMTree
            elements={elements}
            selectedElement={selectedElement}
            onSelectElement={setSelectedElement}
            onDeleteElement={deleteElement}
            onUpdateElement={updateElement}
            onMoveElement={moveElement}
          />
          
          <SettingsPanel
            element={selectedElementData}
            onUpdateElement={updateElement}
          />
        </div>
      </div>
    </div>
  );
};

// Helper functions
function generateBEMClass(elementType) {
  const timestamp = Date.now().toString(36);
  return `${elementType}-${timestamp}`;
}

function generateHTML(elements) {
  const rootElements = elements.filter(el => !el.parentId);
  
  const renderElement = (element, indent = 0) => {
    const spacing = '  '.repeat(indent);
    const elementConfig = HTML_ELEMENTS[element.type];
    const children = elements.filter(el => el.parentId === element.id);
    
    const tag = element.type;
    const attributes = getHTMLAttributes(element);
    
    // Self-closing tags
    if (['img', 'input', 'br', 'hr'].includes(element.type)) {
      return `${spacing}<${tag} ${attributes} />`;
    }
    
    const content = elementConfig?.canHaveChildren ? '' : (element.content || '');
    const hasChildren = children.length > 0;
    
    if (hasChildren) {
      const childrenHTML = children.map(child => renderElement(child, indent + 1)).join('\n');
      return `${spacing}<${tag} ${attributes}>
${content ? `${spacing}  ${content}\n` : ''}${childrenHTML}
${spacing}</${tag}>`;
    } else {
      return `${spacing}<${tag} ${attributes}>${content}</${tag}>`;
    }
  };
  
  return rootElements.map(element => renderElement(element, 1)).join('\n');
}

function generateCSS(elements) {
  return elements.map(element => {
    const selector = `.${element.className}`;
    const styles = Object.entries(element.styles)
      .filter(([key, value]) => {
        // Фільтруємо пусті та дефолтні значення
        if (!value || value === 'auto' || value === '0px' || value === 'static') return false;
        if (key === 'display' && value === 'block') return false;
        return true;
      })
      .map(([key, value]) => `  ${camelToKebab(key)}: ${value};`)
      .join('\n');
    
    return styles ? `${selector} {\n${styles}\n}` : '';
  }).filter(Boolean).join('\n\n');
}

function getHTMLAttributes(element) {
  let attributes = `class="${element.className}"`;
  
  // Додаємо специфічні атрибути
  if (element.attributes) {
    Object.entries(element.attributes).forEach(([key, value]) => {
      if (value) {
        attributes += ` ${key}="${value}"`;
      }
    });
  }
  
  // Додаємо content як атрибут для деяких елементів
  if (element.type === 'img' && element.content) {
    attributes += ` src="${element.content}"`;
  } else if (element.type === 'input' && element.content) {
    attributes += ` placeholder="${element.content}"`;
  } else if (element.type === 'a' && !element.attributes?.href) {
    attributes += ` href="#"`;
  }
  
  return attributes;
}

function camelToKebab(str) {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
}

function downloadFile(filename, content) {
  const element = document.createElement('a');
  const file = new Blob([content], { type: 'text/html' });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  URL.revokeObjectURL(element.href);
}

export default VisualEditor;