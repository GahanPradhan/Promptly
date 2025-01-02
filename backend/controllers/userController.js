const User = require('../models/User');
const Prompt = require('../models/Prompt');

const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.user.id; // Get user ID from auth middleware

    // Fetch user details excluding sensitive fields like password
    const user = await User.findById(userId).select('-password');

    // Fetch all posts created by the user
    const posts = await Prompt.find({ user: userId });
    res.status(200).json({ user, posts });
  } catch (error) {
    console.error('Error fetching profile data:', error);
    res.status(500).json({ message: 'Error fetching profile data' });
  }
};

// Register User
exports.registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body; // Profile picture excluded for now
  let profilePicture = null; // Default to null unless a picture is uploaded

  try {
      // Check if the user already exists
      let user = await User.findOne({ email });
      if (user) {
          return res.status(400).json({ msg: 'User already exists' });
      }
      console.log(req.file);
      // If a file is uploaded, upload it to Cloudinary
      if (req.file) {
          const result = await cloudinary.uploader.upload(req.file.path, {
              folder: "profile_pictures",
              transformation: { width: 200, height: 200, crop: "fill" }, // Optional: Resize and crop
          });
          profilePicture = result.secure_url; // Store the Cloudinary URL
      }

      // Create a new user
      user = new User({ username, email, password, profilePicture });

      // Save the user to the database
      await user.save();

      // Generate JWT token
      const payload = {
          user: {
              id: user.id,
          },
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.json({ token });
  } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
  }
};




const getBookmarkedPrompts = async (req, res) => {
  try {
    const userId = req.user.user.id;

    const user = await User.findById(userId).select('bookmarkedPrompts');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get the bookmarked prompts
    const bookmarkedPromptIds = user.bookmarkedPrompts || [];

    // Fetch the bookmarked prompts from the Prompt model
    const prompts = await Prompt.find({ _id: { $in: bookmarkedPromptIds } }).populate('user', 'username totalPrompts profilePicture');

    // Map through the prompts to add isLiked and isBookmarked
    const promptsStatus = prompts.map((prompt) => ({
      ...prompt.toObject(),
      isLiked: prompt.likedBy.some((user) => user.toString() === userId),
      isBookmarked: bookmarkedPromptIds.includes(prompt._id.toString()),
    }));

    res.status(200).json(promptsStatus);
  } catch (err) {
    console.error('Error fetching bookmarked prompts:', err);
    res.status(500).json({ message: 'An error occurred' });
  }
};


// Controller function to get all users
const getTopUsers = async (req, res) => {
  try {
    // Fetch all users from the MongoDB User collection
    const users = await User.find().sort({ totalPrompts: -1 }).limit(3);
    
    // Respond with a success message and the fetched users
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (err) {
    // If an error occurs, respond with an error message
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};




module.exports = { getUserProfile, getBookmarkedPrompts, getTopUsers};
