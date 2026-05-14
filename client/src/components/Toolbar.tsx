import React from 'react';
import { useBoard } from '../context/BoardContext';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { Undo2, Redo2 } from 'lucide-react';

export const Toolbar: React.FC = () => {
  const { undo, redo, canUndo, canRedo } = useBoard();
  useKeyboardShortcuts();

  return (
    <div className="flex gap-2">
      <button
        onClick={undo}
        disabled={!canUndo}
        className="p-2 bg-gray-100 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-200 transition-colors"
        title="Undo (Ctrl+Z)"
      >
        <Undo2 size={18} />
      </button>
      <button
        onClick={redo}
        disabled={!canRedo}
        className="p-2 bg-gray-100 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-200 transition-colors"
        title="Redo (Ctrl+Shift+Z)"
      >
        <Redo2 size={18} />
      </button>
    </div>
  );
};
