import { Router } from 'express';

const router = Router();

// User CRUD

// Create user
router.post('/', (req, res) => {
  res.status(501).json({ error: 'Not Implemented' });
});

// list users
router.get('/', (req, res) => {
  res.status(501).json({ error: 'Not Implemented' });
});

// get one user
router.get('/:id', (req, res) => {
  const { id } = req.params;
  res.status(501).json({ error: `Not Implemented: ${id}` });
});

// update user
router.put('/:id', (req, res) => {
  const { id } = req.params;
  res.status(501).json({ error: `Not Implemented: ${id}` });
});

// delete user
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  res.status(501).json({ error: `Not Implemented: ${id}` });
});

export default router;
