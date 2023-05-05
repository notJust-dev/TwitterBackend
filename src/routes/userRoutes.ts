import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// User CRUD

/*
  Test with curl:

  curl -X POST -H "Content-Type: application/json" \
       -d '{"name": "Elon Musk", "email": "doge@twitter.com", "username": "elon"}' \
       http://localhost:3000/user/

*/
// Create user
router.post('/', async (req, res) => {
  const { email, name, username } = req.body;

  try {
    const result = await prisma.user.create({
      data: {
        email,
        name,
        username,
        bio: "Hello, I'm new on Twitter",
      },
    });

    res.json(result);
  } catch (e) {
    res.status(400).json({ error: 'Username and email should be unique' });
  }
});

// list users
router.get('/', async (req, res) => {
  const allUser = await prisma.user.findMany({
    // select: {
    //   id: true,
    //   name: true,
    //   image: true,
    //   bio: true,
    // },
  });

  res.json(allUser);
});

// get one user
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    include: { tweets: true },
  });

  res.json(user);
});

/*
  Test with curl:

  curl -X PUT -H "Content-Type: application/json" \
       -d '{"name": "Vadim", "bio": "Hello there!"}' \
       http://localhost:3000/user/1

*/
// update user
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { bio, name, image } = req.body;

  try {
    const result = await prisma.user.update({
      where: { id: Number(id) },
      data: { bio, name, image },
    });
    res.json(result);
  } catch (e) {
    res.status(400).json({ error: `Failed to update the user` });
  }
});

// curl -X DELETE http://localhost:3000/user/6
// delete user
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.user.delete({ where: { id: Number(id) } });
  res.sendStatus(200);
});

export default router;
