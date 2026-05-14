import { BoardState, Card } from './types';

const API_BASE = '/api/board';

export const fetchBoard = async (): Promise<BoardState> => {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error('Failed to fetch board');
  return res.json();
};

export const createCardApi = async (columnId: string, title: string, description: string): Promise<Card> => {
  const res = await fetch(`${API_BASE}/cards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ columnId, title, description }),
  });
  if (!res.ok) throw new Error('Failed to create card');
  return res.json();
};

export const updateCardApi = async (cardId: string, updates: Partial<Card>): Promise<Card> => {
  const res = await fetch(`${API_BASE}/cards/${cardId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update card');
  return res.json();
};

export const deleteCardApi = async (cardId: string): Promise<void> => {
  const res = await fetch(`${API_BASE}/cards/${cardId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete card');
};

export const moveCardApi = async (cardId: string, targetColumnId: string, newOrder: number): Promise<{ card: Card, board: BoardState }> => {
  const res = await fetch(`${API_BASE}/cards/${cardId}/move`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ targetColumnId, newOrder }),
  });
  if (!res.ok) throw new Error('Failed to move card');
  return res.json();
};
