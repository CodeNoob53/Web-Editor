import React, { useState, useCallback } from 'react';
import TopBar from './TopBar/TopBar';
import Toolbox from './Toolbox/Toolbox';
import EditorCanvas from './Canvas/EditorCanvas';
import SettingsPanel from './Settings/SettingsPanel';
import DOMTree from './DOMTree/DOMTree';
import { v4 as uuidv4 } from 'uuid';
import './VisualEditor.css';

const VisualEditor = () => {
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [canvasZoom, setCanvasZoom] = useState(100);

  const addElement = useCallback((elementType, parentId = null) => {
    // If there's a selected element that can have children, use it as parent
    const targetParentId = parentId || (
      selectedElement && 
      elements.find(el => el.id === selectedElement) &&
      ['div', 'section', 'nav', 'article'].includes(elements.find(el => el.id === selectedElement).type)
        ? selectedElement 
        : null
    );

    const newElement = {
      id: uuidv4(),
      type: elementType,
      parentId: targetParentId,
      styles: getDefaultStyles(elementType),
      content: getDefaultContent(elementType),
      className: generateBEMClass(elementType)
    };

    setElements(prev => [...prev, newElement]);
    setSelectedElement(newElement.id);
  }, [selectedElement, elements]);

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
      // Remove element and all its children recursively
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
    setElements(prev => 
      prev.map(el => 
        el.id === elementId 
          ? { ...el, parentId: newParentId }
          : el
      )
    );
  }, []);

  const exportProject = useCallback(() => {
    const html = generateHTML(elements);
    const css = generateCSS(elements);
    
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Page</title>
    <style>
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
        <Toolbox onAddElement={addElement} />
        
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
function getDefaultStyles(elementType) {
  const baseStyles = {
    display: 'flex',
    flexDirection: 'column',
    padding: '16px',
    margin: '0px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '0px',
    fontSize: '16px',
    fontFamily: 'inherit',
    color: '#1d1d1f',
    width: 'auto',
    height: 'auto',
    minWidth: '0px',
    minHeight: '0px',
    position: 'static',
    top: '0px',
    right: '0px',
    bottom: '0px',
    left: '0px',
    zIndex: '0'
  };

  switch (elementType) {
    case 'button':
      return {
        ...baseStyles,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#007AFF',
        color: '#ffffff',
        border: 'none',
        borderRadius: '8px',
        padding: '12px 24px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '500',
        width: 'auto',
        height: 'auto'
      };
    case 'text':
      return {
        ...baseStyles,
        display: 'block',
        padding: '8px',
        width: 'auto',
        height: 'auto'
      };
    case 'img':
      return {
        ...baseStyles,
        display: 'block',
        width: '200px',
        height: '150px',
        objectFit: 'cover',
        padding: '0px'
      };
    case 'input':
      return {
        ...baseStyles,
        display: 'block',
        border: '1px solid #d1d1d6',
        borderRadius: '8px',
        padding: '12px 16px',
        fontSize: '16px',
        width: '200px',
        height: 'auto'
      };
    default:
      return {
        ...baseStyles,
        minHeight: '50px'
      };
  }
}

function getDefaultContent(elementType) {
  switch (elementType) {
    case 'text':
      return 'Текст';
    case 'button':
      return 'Кнопка';
    case 'img':
      return 'https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg?auto=compress&cs=tinysrgb&w=400';
    case 'input':
      return 'Введіть текст';
    default:
      return '';
  }
}

function generateBEMClass(elementType) {
  return `${elementType}`;
}

function generateHTML(elements) {
  const rootElements = elements.filter(el => !el.parentId);
  
  const renderElement = (element) => {
    const children = elements.filter(el => el.parentId === element.id);
    const childrenHTML = children.map(renderElement).join('\n    ');
    
    const tag = getHTMLTag(element.type);
    const attributes = getHTMLAttributes(element);
    
    if (element.type === 'img') {
      return `  <${tag} ${attributes} />`;
    }
    
    const content = element.type === 'text' ? element.content : '';
    const hasChildren = children.length > 0;
    
    if (hasChildren) {
      return `  <${tag} ${attributes}>
    ${content}
    ${childrenHTML}
  </${tag}>`;
    } else {
      return `  <${tag} ${attributes}>${content}</${tag}>`;
    }
  };
  
  return rootElements.map(renderElement).join('\n');
}

function generateCSS(elements) {
  return elements.map(element => {
    const selector = `.${element.className}`;
    const styles = Object.entries(element.styles)
      .filter(([key, value]) => value && value !== '0px' && value !== 'auto' && value !== 'static')
      .map(([key, value]) => `  ${camelToKebab(key)}: ${value};`)
      .join('\n');
    
    return `${selector} {\n${styles}\n}`;
  }).join('\n\n');
}

function getHTMLTag(elementType) {
  switch (elementType) {
    case 'text': return 'p';
    case 'button': return 'button';
    case 'img': return 'img';
    case 'input': return 'input';
    default: return elementType;
  }
}

function getHTMLAttributes(element) {
  let attributes = `class="${element.className}"`;
  
  if (element.type === 'img') {
    attributes += ` src="${element.content}" alt="Image"`;
  } else if (element.type === 'input') {
    attributes += ` type="text" placeholder="${element.content}"`;
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
}

export default VisualEditor;