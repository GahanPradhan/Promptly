const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); 
const User = require('../models/User'); 
const { getUserProfile, getBookmarkedPrompts, getTopUsers } = require('../controllers/userController');

router.get('/profile', auth, getUserProfile);
router.get('/bookmarks', auth, getBookmarkedPrompts);
router.get('/leaderboard',auth,getTopUsers);


module.exports = router;