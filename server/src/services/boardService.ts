import { BoardState, Card, Column } from '../models/types';
import { v4 as uuidv4 } from 'uuid';

// In-memory data store for initial implementation.
// Can be replaced with a SQLite or LocalStorage repository later.
let state: BoardState = {
  columns: {
    'col-1': { id: 'col-1', title: 'To Do', order: 0 },
    'col-2': { id: 'col-2', title: 'In Progress', order: 1 },
    'col-3': { id: 'col-3', title: 'Done', order: 2 },
  },
  cards: {},
  columnOrder: ['col-1', 'col-2', 'col-3'],
};

// Reset state (useful for testing)
export const resetState = (newState?: BoardState) => {
  if (newState) {
    state = JSON.parse(JSON.stringify(newState));
  } else {
    state = {
      columns: {
        'col-1': { id: 'col-1', title: 'To Do', order: 0 },
        'col-2': { id: 'col-2', title: 'In Progress', order: 1 },
        'col-3': { id: 'col-3', title: 'Done', order: 2 },
      },
      cards: {},
      columnOrder: ['col-1', 'col-2', 'col-3'],
    };
  }
};

export const getBoardState = (): BoardState => {
  return state;
};

export const addCard = (columnId: string, title: string, description: string): Card => {
  if (!state.columns[columnId]) {
    throw new Error('Column does not exist');
  }

  const id = uuidv4();
  
  // Determine new order (append to bottom of column)
  const existingCardsInCol = Object.values(state.cards)
    .filter(c => c.columnId === columnId)
    .sort((a, b) => a.order - b.order);
    
  const newOrder = existingCardsInCol.length > 0 
    ? existingCardsInCol[existingCardsInCol.length - 1].order + 1 
    : 0;

  const newCard: Card = {
    id,
    columnId,
    title,
    description,
    order: newOrder,
    createdAt: Date.now(),
  };

  state.cards[id] = newCard;
  return newCard;
};

export const updateCard = (cardId: string, updates: Partial<Pick<Card, 'title' | 'description'>>): Card => {
  const card = state.cards[cardId];
  if (!card) {
    throw new Error('Card not found');
  }

  state.cards[cardId] = { ...card, ...updates };
  return state.cards[cardId];
};

export const deleteCard = (cardId: string): void => {
  if (!state.cards[cardId]) {
    throw new Error('Card not found');
  }
  delete state.cards[cardId];
};

export const moveCard = (cardId: string, targetColumnId: string, newOrder: number): Card => {
  const card = state.cards[cardId];
  if (!card) throw new Error('Card not found');
  if (!state.columns[targetColumnId]) throw new Error('Target column does not exist');

  const oldColumnId = card.columnId;
  card.columnId = targetColumnId;

  // Reorder target column cards to make space
  const targetCards = Object.values(state.cards)
    .filter(c => c.columnId === targetColumnId && c.id !== cardId)
    .sort((a, b) => a.order - b.order);

  targetCards.splice(newOrder, 0, card);

  // Update order properties for all cards in the target column
  targetCards.forEach((c, idx) => {
    state.cards[c.id].order = idx;
  });

  // If moving between different columns, compress the old column's order
  if (oldColumnId !== targetColumnId) {
    const oldCards = Object.values(state.cards)
      .filter(c => c.columnId === oldColumnId)
      .sort((a, b) => a.order - b.order);
      
    oldCards.forEach((c, idx) => {
      state.cards[c.id].order = idx;
    });
  }

  return state.cards[cardId];
};
