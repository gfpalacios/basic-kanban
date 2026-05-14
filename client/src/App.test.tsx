import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import * as api from './api';

// Mock the API calls
jest.mock('./api', () => ({
  fetchBoard: jest.fn(),
  createCardApi: jest.fn(),
  updateCardApi: jest.fn(),
  deleteCardApi: jest.fn(),
  moveCardApi: jest.fn(),
}));

const mockBoard = {
  columns: {
    'col-1': { id: 'col-1', title: 'To Do' },
    'col-2': { id: 'col-2', title: 'In Progress' },
  },
  columnOrder: ['col-1', 'col-2'],
  cards: {
    'card-1': { id: 'card-1', title: 'Test Card 1', description: '', columnId: 'col-1', order: 0 },
  }
};

describe('App Happy Path', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the board, fetches data, and allows adding a new card', async () => {
    const user = userEvent.setup();
    (api.fetchBoard as jest.Mock).mockResolvedValueOnce(mockBoard);

    render(<App />);

    // Wait for the loading to finish and board to display
    expect(screen.getByText('Loading board...')).toBeInTheDocument();
    
    // Wait for the columns to render
    await waitFor(() => {
      expect(screen.getByText('To Do')).toBeInTheDocument();
    });
    
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Test Card 1')).toBeInTheDocument();

    // Find the Add Card button in the To Do column (col-1)
    // There are multiple "Add Card" buttons (one per column)
    const addCardButtons = screen.getAllByRole('button', { name: /add card/i });
    expect(addCardButtons).toHaveLength(2);

    // Click "Add Card" on the first column (To Do)
    await user.click(addCardButtons[0]);

    // Now an input should appear
    const input = screen.getByPlaceholderText('Card title...');
    expect(input).toBeInTheDocument();

    // Type a new card title
    await user.type(input, 'My New Task');

    // Mock the API response for creating a card
    (api.createCardApi as jest.Mock).mockResolvedValueOnce({
      id: 'card-2',
      title: 'My New Task',
      description: '',
      columnId: 'col-1',
      order: 1
    });

    // Click the "Add" submit button
    const submitButton = screen.getByRole('button', { name: 'Add' });
    await user.click(submitButton);

    // Wait for the new card to appear in the UI
    await waitFor(() => {
      expect(screen.getByText('My New Task')).toBeInTheDocument();
    });

    expect(api.createCardApi).toHaveBeenCalledWith('col-1', 'My New Task', '');
  });

  it('allows deleting a card and using undo', async () => {
    const user = userEvent.setup();
    (api.fetchBoard as jest.Mock).mockResolvedValueOnce(mockBoard);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Test Card 1')).toBeInTheDocument();
    });

    (api.deleteCardApi as jest.Mock).mockResolvedValueOnce(undefined);

    const deleteButton = screen.getByRole('button', { name: 'Delete card' });
    
    // Click delete
    await user.click(deleteButton);

    // Wait for the card to be removed
    await waitFor(() => {
      expect(screen.queryByText('Test Card 1')).not.toBeInTheDocument();
    });

    expect(api.deleteCardApi).toHaveBeenCalledWith('card-1');

    // Click undo button
    const undoButton = screen.getByRole('button', { name: /undo/i });
    await user.click(undoButton);

    // Card should be back
    await waitFor(() => {
      expect(screen.getByText('Test Card 1')).toBeInTheDocument();
    });
  });
});
