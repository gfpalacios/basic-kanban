export interface Card {
  id: string;
  columnId: string;
  title: string;
  description: string;
  order: number;
  createdAt: number;
}

export interface Column {
  id: string;
  title: string;
  order: number;
}

export interface BoardState {
  columns: Record<string, Column>;
  cards: Record<string, Card>;
  columnOrder: string[];
}
