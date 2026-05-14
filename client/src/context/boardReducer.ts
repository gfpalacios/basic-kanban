import { BoardState, Card } from '../types';

export interface UndoableState {
  past: BoardState[];
  present: BoardState | null;
  future: BoardState[];
}

export type Action =
  | { type: 'SET_BOARD'; payload: BoardState }
  | { type: 'ADD_CARD'; payload: { card: Card } }
  | { type: 'UPDATE_CARD'; payload: { cardId: string; updates: Partial<Card> } }
  | { type: 'DELETE_CARD'; payload: { cardId: string } }
  | { type: 'MOVE_CARD'; payload: { cardId: string; targetColumnId: string; newOrder: number } }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'ROLLBACK' };

export const initialState: UndoableState = {
  past: [],
  present: null,
  future: [],
};

const pushState = (state: UndoableState, newPresent: BoardState): UndoableState => {
  if (!state.present) return { ...state, present: newPresent };
  return {
    past: [...state.past, state.present],
    present: newPresent,
    future: [],
  };
};

export const boardReducer = (state: UndoableState, action: Action): UndoableState => {
  switch (action.type) {
    case 'SET_BOARD':
      // Overwrite entirely (usually on initial load)
      return { ...state, present: action.payload };

    case 'ADD_CARD': {
      if (!state.present) return state;
      const { card } = action.payload;
      const newState = JSON.parse(JSON.stringify(state.present)) as BoardState;
      newState.cards[card.id] = card;
      return pushState(state, newState);
    }

    case 'UPDATE_CARD': {
      if (!state.present) return state;
      const { cardId, updates } = action.payload;
      const newState = JSON.parse(JSON.stringify(state.present)) as BoardState;
      if (newState.cards[cardId]) {
        newState.cards[cardId] = { ...newState.cards[cardId], ...updates };
      }
      return pushState(state, newState);
    }

    case 'DELETE_CARD': {
      if (!state.present) return state;
      const { cardId } = action.payload;
      const newState = JSON.parse(JSON.stringify(state.present)) as BoardState;
      delete newState.cards[cardId];
      return pushState(state, newState);
    }

    case 'MOVE_CARD': {
      if (!state.present) return state;
      const { cardId, targetColumnId, newOrder } = action.payload;
      const newState = JSON.parse(JSON.stringify(state.present)) as BoardState;
      
      const card = newState.cards[cardId];
      if (!card) return state;

      const oldColumnId = card.columnId;
      card.columnId = targetColumnId;

      const targetCards = Object.values(newState.cards)
        .filter(c => c.columnId === targetColumnId && c.id !== cardId)
        .sort((a, b) => a.order - b.order);

      targetCards.splice(newOrder, 0, card);
      targetCards.forEach((c, idx) => { newState.cards[c.id].order = idx; });

      if (oldColumnId !== targetColumnId) {
        const oldCards = Object.values(newState.cards)
          .filter(c => c.columnId === oldColumnId)
          .sort((a, b) => a.order - b.order);
        oldCards.forEach((c, idx) => { newState.cards[c.id].order = idx; });
      }

      return pushState(state, newState);
    }

    case 'UNDO': {
      if (state.past.length === 0 || !state.present) return state;
      const previous = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, state.past.length - 1);
      return {
        past: newPast,
        present: previous,
        future: [state.present, ...state.future],
      };
    }

    case 'REDO': {
      if (state.future.length === 0 || !state.present) return state;
      const next = state.future[0];
      const newFuture = state.future.slice(1);
      return {
        past: [...state.past, state.present],
        present: next,
        future: newFuture,
      };
    }

    case 'ROLLBACK': {
      // Rollback is like Undo, but we DO NOT save the present to the future
      // Used to revert optimistic updates if API fails.
      if (state.past.length === 0 || !state.present) return state;
      const previous = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, state.past.length - 1);
      return {
        past: newPast,
        present: previous,
        future: state.future, // leave future untouched
      };
    }

    default:
      return state;
  }
};
