import React from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useBoard } from '../context/BoardContext';
import { ColumnComponent } from './Column';
import { CardComponent } from './Card';
import { Card as CardType } from '../types';

export const Board: React.FC = () => {
  const { board, isLoading, moveCard } = useBoard();
  const [activeCard, setActiveCard] = React.useState<CardType | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }, // Prevents accidental drags on click
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (isLoading) {
    return <div className="h-full flex items-center justify-center">Loading board...</div>;
  }

  if (!board) return null;

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const card = board.cards[active.id as string];
    if (card) setActiveCard(card);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveCard(null);
    const { active, over } = event;
    
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const activeCard = board.cards[activeId];
    if (!activeCard) return;

    // Check if dropping over a column or another card
    const overCard = board.cards[overId];
    const isOverAColumn = board.columns[overId] !== undefined;

    let targetColumnId = '';
    let newOrder = 0;

    if (isOverAColumn) {
      targetColumnId = overId;
      // Dropping onto empty space in a column -> append to bottom
      const columnCards = Object.values(board.cards).filter(c => c.columnId === targetColumnId);
      newOrder = columnCards.length;
    } else if (overCard) {
      targetColumnId = overCard.columnId;
      newOrder = overCard.order;
      
      // Adjust if we are moving within the same column downwards
      if (activeCard.columnId === overCard.columnId && activeCard.order < overCard.order) {
        newOrder = overCard.order; // will splice right after
      }
    } else {
      return;
    }

    moveCard(activeId, targetColumnId, newOrder);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full gap-6 overflow-x-auto pb-4 no-scrollbar">
        {board.columnOrder.map(colId => (
          <ColumnComponent key={colId} column={board.columns[colId]} cards={Object.values(board.cards).filter(c => c.columnId === colId)} />
        ))}
      </div>
      <DragOverlay>
        {activeCard ? <CardComponent card={activeCard} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
};
