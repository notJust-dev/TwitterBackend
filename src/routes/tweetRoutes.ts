import { Router } from 'express';

const router = Router();

// Tweet CRUD

// Create Tweet
router.post('/', (req, res) => {
  res.status(501).json({ error: 'Not Implemented' });
});

// list Tweet
router.get('/', (req, res) => {
  res.status(501).json({ error: 'Not Implemented' });
});

// get one Tweet
router.get('/:id', (req, res) => {
  const { id } = req.params;
  res.status(501).json({ error: `Not Implemented: ${id}` });
});

// update Tweet
router.put('/:id', (req, res) => {
  const { id } = req.params;
  res.status(501).json({ error: `Not Implemented: ${id}` });
});

// delete Tweet
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  res.status(501).json({ error: `Not Implemented: ${id}` });
});

export default router;
