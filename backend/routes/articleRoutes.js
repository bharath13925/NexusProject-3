const express = require('express');
const router = express.Router();
const Article = require('../models/Article');

// Get all article bookmarks
router.get('/', async (req, res) => {
  try {
    const articles = await Article.find();
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching articles' });
  }
});

// Add a new article bookmark
router.post('/', async (req, res) => {
  const { title, source, date, snippet } = req.body;
  
  const newArticle = new Article({
    title,
    source,
    date,
    snippet,
    saved: true
  });

  try {
    const savedArticle = await newArticle.save();
    res.status(201).json(savedArticle);
  } catch (error) {
    res.status(500).json({ message: 'Error saving article bookmark' });
  }
});

// Delete an article bookmark by ID
router.delete('/:id', async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.json({ message: 'Article bookmark removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting article bookmark' });
  }
});

module.exports = router;
