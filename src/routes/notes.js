const express = require("express");
const { body, param, query, validationResult } = require("express-validator");
const router = express.Router();

// Create Note
router.post(
  "/notes",
  [
    body("title").isString().notEmpty(),
    body("content").isString().notEmpty(),
    body("tags").optional().isArray(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const { title, content, tags, ownerId } = req.body;
      const note = await prisma.note.create({
        data: { title, content, tags, ownerId },
      });
      res.status(201).json(note);
    } catch (err) {
      next(err);
    }
  }
);

// Fetch all notes with pagination
router.get(
  "/notes",
  [
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 100 }),
  ],
  async (req, res, next) => {
    try {
      const { page = 1, limit = 10, tags, search } = req.query;
      const where = {
        isDeleted: false,
        ...(tags && { tags: { hasEvery: tags.split(",") } }),
        ...(search && {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { content: { contains: search, mode: "insensitive" } },
          ],
        }),
      };
      const notes = await prisma.note.findMany({
        where,
        skip: (page - 1) * limit,
        take: parseInt(limit),
      });
      res.json(notes);
    } catch (err) {
      next(err);
    }
  }
);

// Soft delete note
router.delete("/notes/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const note = await prisma.note.update({
      where: { id: parseInt(id) },
      data: { isDeleted: true, deletedAt: new Date() },
    });
    res.json(note);
  } catch (err) {
    next(err);
  }
});

module.exports = router;


router.post(
    "/notes/:id/share",
    [
      param("id").isInt(),
      body("email").isEmail(),
    ],
    async (req, res, next) => {
      try {
        const { id } = req.params;
        const { email } = req.body;
        const note = await prisma.note.findUnique({ where: { id: parseInt(id) } });
  
        if (!note) return res.status(404).json({ message: "Note not found" });
  
        await transporter.sendMail({
          from: process.env.SMTP_USER,
          to: email,
          subject: "Shared Note",
          text: `A note has been shared with you. Title: ${note.title}`,
        });
        res.json({ message: "Note shared successfully" });
      } catch (err) {
        next(err);
      }
    }
  );

router.post("/test", (req, res) => {
  const { message } = req.body;
  res.json({
    receivedMessage: message,
    envCheck: process.env.TEST_ENV || "No Env Set"
  });
});

module.exports = router;