const express = require('express');
const { getAllPrompts, createPrompt, upvotePrompt, downvotePrompt, likePrompt, bookmarkPrompt, savePromptOutput } = require('../controllers/promptController');
const auth = require('../middleware/auth');
const router = express.Router();
const upload = require('../middleware/upload');


router.get('/',auth, getAllPrompts); // Get all prompts
router.post('/:id/upvote', auth, upvotePrompt); // Upvote a prompt
router.post('/:id/downvote', auth, downvotePrompt); // Downvote a prompt
router.post('/:id/like', auth, likePrompt); // Like a prompt
router.post('/', auth, upload.single('image'), createPrompt);// Create a prompt (requires authentication)
router.post('/:id/bookmark', auth, bookmarkPrompt);
router.post('/save-prompt-output', savePromptOutput);



module.exports = router;