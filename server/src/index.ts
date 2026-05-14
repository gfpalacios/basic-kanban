import express from 'express';
import cors from 'cors';
import boardRoutes from './routes/boardRoutes';

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/board', boardRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

const PORT = process.env.PORT || 3001;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

export default app;
