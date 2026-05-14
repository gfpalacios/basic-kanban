import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card as CardType } from '../types';
import { Trash2 } from 'lucide-react';
import { useBoard } from '../context/BoardContext';

interface CardProps {
  card: CardType;
  isOverlay?: boolean;
}

export const CardComponent: React.FC<CardProps> = ({ card, isOverlay }) => {
  const { deleteCard } = useBoard();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteCard(card.id);
  };

  if (isDragging && !isOverlay) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-gray-200 border-2 border-dashed border-gray-400 rounded-lg h-24 opacity-50"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white p-4 rounded shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing group relative ${
        isOverlay ? 'shadow-xl scale-105 rotate-2' : 'hover:border-gray-300'
      }`}
    >
      <div className="flex justify-between items-start">
        <h4 className="font-medium text-gray-800 text-sm break-words pr-6">{card.title}</h4>
        <button
          onClick={handleDelete}
          aria-label="Delete card"
          className="absolute right-3 top-3 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 size={14} />
        </button>
      </div>
      {card.description && (
        <p className="text-xs text-gray-500 mt-2 line-clamp-2">{card.description}</p>
      )}
    </div>
  );
};
