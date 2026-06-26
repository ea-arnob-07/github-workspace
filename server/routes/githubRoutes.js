const express = require('express');
const router = express.Router();
const multer = require('multer');
const githubController = require('../controllers/githubController');
const { requireAuth } = require('../middleware/authMiddleware');

// Setup multer for memory storage (files kept in RAM for API forwarding)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB limit per file as safety
});

router.use(requireAuth); // All github routes require auth

router.get('/my-repos', githubController.getMyRepos);
router.post('/repos', githubController.createRepo);
router.post('/repos/:owner/:repo/upload', upload.array('files'), githubController.uploadFiles);
router.post('/repos/:owner/:repo/pages', githubController.enablePages);
router.get('/repos/:owner/:repo/pages/status', githubController.getPagesStatus);

module.exports = router;
