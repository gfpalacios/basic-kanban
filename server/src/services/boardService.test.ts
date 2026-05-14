import { addCard, getBoardState, moveCard, resetState, updateCard, deleteCard } from './boardService';

// Mock uuid so we can assert on IDs
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid')
}));

describe('Board Service', () => {
  beforeEach(() => {
    resetState();
  });

  describe('addCard', () => {
    it('should add a new card to a valid column', () => {
      const card = addCard('col-1', 'Task 1', 'Description 1');
      expect(card.id).toBe('mock-uuid');
      expect(card.columnId).toBe('col-1');
      expect(card.title).toBe('Task 1');
      expect(card.order).toBe(0);
      
      const state = getBoardState();
      expect(state.cards['mock-uuid']).toBeDefined();
    });

    it('should assign correct order when adding multiple cards to the same column', () => {
      // Temporarily override the uuid mock to generate unique IDs for this test
      const uuidv4 = require('uuid').v4;
      uuidv4.mockReturnValueOnce('uuid-1').mockReturnValueOnce('uuid-2');

      const card1 = addCard('col-1', 'Task 1', 'Desc 1');
      const card2 = addCard('col-1', 'Task 2', 'Desc 2');

      expect(card1.order).toBe(0);
      expect(card2.order).toBe(1);
    });

    it('should throw an error if column does not exist', () => {
      expect(() => addCard('invalid-col', 'Task', 'Desc')).toThrow('Column does not exist');
    });
  });

  describe('updateCard and deleteCard', () => {
    it('should update a cards title or description', () => {
      addCard('col-1', 'Task 1', 'Desc');
      const updated = updateCard('mock-uuid', { title: 'Updated Task' });
      expect(updated.title).toBe('Updated Task');
      expect(updated.description).toBe('Desc');
    });

    it('should delete a card', () => {
      addCard('col-1', 'Task 1', 'Desc');
      deleteCard('mock-uuid');
      expect(getBoardState().cards['mock-uuid']).toBeUndefined();
    });
  });

  describe('moveCard', () => {
    beforeEach(() => {
      const uuidv4 = require('uuid').v4;
      uuidv4
        .mockReturnValueOnce('card-1')
        .mockReturnValueOnce('card-2')
        .mockReturnValueOnce('card-3');
      
      addCard('col-1', 'Task 1', ''); // card-1, order: 0
      addCard('col-1', 'Task 2', ''); // card-2, order: 1
      addCard('col-2', 'Task 3', ''); // card-3, order: 0
    });

    it('should reorder cards within the same column', () => {
      // Move Task 1 (card-1) below Task 2 (card-2)
      moveCard('card-1', 'col-1', 1);
      
      const state = getBoardState();
      expect(state.cards['card-2'].order).toBe(0);
      expect(state.cards['card-1'].order).toBe(1);
    });

    it('should move a card to a different column and update orders in both', () => {
      // Move Task 2 (card-2) to the top of col-2
      moveCard('card-2', 'col-2', 0);
      
      const state = getBoardState();
      
      // col-1 should now only have card-1 at order 0
      expect(state.cards['card-1'].order).toBe(0);
      
      // col-2 should have card-2 at order 0, and card-3 bumped to order 1
      expect(state.cards['card-2'].columnId).toBe('col-2');
      expect(state.cards['card-2'].order).toBe(0);
      expect(state.cards['card-3'].order).toBe(1);
    });
  });
});
