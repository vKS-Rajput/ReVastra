import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
  const { token } = req.headers;

  if (!token) {
    return res.json({ success: false, message: 'Not Authorized. Login Again.' });
  }

  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: token_decode.id }; // ✅ Attach to req.user
    next();
  } catch (error) {
    console.log('Token verification error:', error);
    res.json({ success: false, message: error.message });
  }
};

export default authUser;
