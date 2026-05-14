import { Router, Request, Response } from 'express';
import { 
  getBoardState, 
  addCard, 
  updateCard, 
  deleteCard, 
  moveCard 
} from '../services/boardService';

const router = Router();

// GET /api/board
router.get('/', (req: Request, res: Response) => {
  try {
    const state = getBoardState();
    res.json(state);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/cards
router.post('/cards', (req: Request, res: Response) => {
  try {
    const { columnId, title, description } = req.body;
    if (!columnId || !title) {
      return res.status(400).json({ error: 'columnId and title are required' });
    }
    
    const newCard = addCard(columnId, title, description || '');
    res.status(201).json(newCard);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// PATCH /api/cards/:id
router.patch('/cards/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const updatedCard = updateCard(id, { title, description });
    res.json(updatedCard);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

// DELETE /api/cards/:id
router.delete('/cards/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    deleteCard(id);
    res.status(204).send();
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

// POST /api/cards/:id/move
router.post('/cards/:id/move', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { targetColumnId, newOrder } = req.body;
    
    if (!targetColumnId || newOrder === undefined) {
      return res.status(400).json({ error: 'targetColumnId and newOrder are required' });
    }

    const movedCard = moveCard(id, targetColumnId, newOrder);
    res.json({ success: true, card: movedCard, board: getBoardState() });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
