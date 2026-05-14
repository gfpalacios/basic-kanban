import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card as CardType, Column as ColumnType } from '../types';
import { CardComponent } from './Card';
import { useBoard } from '../context/BoardContext';
import { Plus } from 'lucide-react';

interface ColumnProps {
  column: ColumnType;
  cards: CardType[];
}

export const ColumnComponent: React.FC<ColumnProps> = ({ column, cards }) => {
  const { setNodeRef } = useDroppable({ id: column.id });
  const { addCard } = useBoard();
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const sortedCards = [...cards].sort((a, b) => a.order - b.order);

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addCard(column.id, newTitle, '');
    setNewTitle('');
    setIsAdding(false);
  };

  return (
    <div
      className="flex flex-col bg-gray-100 rounded-lg w-80 min-w-[320px] max-h-full"
      ref={setNodeRef}
    >
      <div className="p-3 font-semibold text-gray-700 flex justify-between items-center border-b border-gray-200">
        <h3>{column.title}</h3>
        <span className="text-sm bg-gray-200 text-gray-600 px-2 py-1 rounded-full">{cards.length}</span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
        <SortableContext
          items={sortedCards.map(c => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {sortedCards.map((card) => (
            <CardComponent key={card.id} card={card} />
          ))}
        </SortableContext>
      </div>

      <div className="p-3 border-t border-gray-200">
        {isAdding ? (
          <form onSubmit={handleAddCard} className="flex flex-col gap-2">
            <input
              type="text"
              autoFocus
              className="w-full px-2 py-1 border rounded text-sm outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Card title..."
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
            />
            <div className="flex gap-2">
              <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded text-sm flex-1">Add</button>
              <button type="button" onClick={() => setIsAdding(false)} className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm">Cancel</button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full flex items-center justify-center gap-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 p-2 rounded transition-colors"
          >
            <Plus size={16} /> Add Card
          </button>
        )}
      </div>
    </div>
  );
};
