import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { BoardState, Card } from '../types';
import { boardReducer, initialState } from './boardReducer';
import * as api from '../api';

interface BoardContextProps {
  board: BoardState | null;
  isLoading: boolean;
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  addCard: (columnId: string, title: string, description: string) => Promise<void>;
  updateCard: (cardId: string, updates: Partial<Card>) => Promise<void>;
  deleteCard: (cardId: string) => Promise<void>;
  moveCard: (cardId: string, targetColumnId: string, newOrder: number) => Promise<void>;
}

const BoardContext = createContext<BoardContextProps | undefined>(undefined);

export const BoardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(boardReducer, initialState);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    api.fetchBoard()
      .then(data => dispatch({ type: 'SET_BOARD', payload: data }))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const undo = () => dispatch({ type: 'UNDO' });
  const redo = () => dispatch({ type: 'REDO' });

  const addCard = async (columnId: string, title: string, description: string) => {
    // Cannot do optimistic insert easily without ID, so we await API here
    // In a real robust system, we'd generate a temporary ID.
    try {
      const newCard = await api.createCardApi(columnId, title, description);
      dispatch({ type: 'ADD_CARD', payload: { card: newCard } });
    } catch (err) {
      console.error('Failed to add card:', err);
    }
  };

  const updateCard = async (cardId: string, updates: Partial<Card>) => {
    dispatch({ type: 'UPDATE_CARD', payload: { cardId, updates } });
    try {
      await api.updateCardApi(cardId, updates);
    } catch (err) {
      dispatch({ type: 'ROLLBACK' });
      console.error('Failed to update card, rolled back:', err);
    }
  };

  const deleteCard = async (cardId: string) => {
    dispatch({ type: 'DELETE_CARD', payload: { cardId } });
    try {
      await api.deleteCardApi(cardId);
    } catch (err) {
      dispatch({ type: 'ROLLBACK' });
    }
  };

  const moveCard = async (cardId: string, targetColumnId: string, newOrder: number) => {
    dispatch({ type: 'MOVE_CARD', payload: { cardId, targetColumnId, newOrder } });
    try {
      await api.moveCardApi(cardId, targetColumnId, newOrder);
    } catch (err) {
      dispatch({ type: 'ROLLBACK' });
      console.error('Failed to move card, rolled back:', err);
    }
  };

  const value = {
    board: state.present,
    isLoading,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
    undo,
    redo,
    addCard,
    updateCard,
    deleteCard,
    moveCard,
  };

  return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>;
};

export const useBoard = () => {
  const ctx = useContext(BoardContext);
  if (!ctx) throw new Error('useBoard must be used within BoardProvider');
  return ctx;
};
