import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import VisualEditor from './components/VisualEditor';
import './App.css';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app">
        <VisualEditor />
      </div>
    </DndProvider>
  );
}

export default App;