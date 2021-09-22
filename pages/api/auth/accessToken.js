import User from '../../../models/User';
import jwt from 'jsonwebtoken';
import { createAccessToken } from '../../../utils/token';
import db from '../../../utils/db';

db.connect();

export default async function handler(req, res) {
  try {
    const rf_token = req.cookies.refreshToken;
    if (!rf_token) return res.status(400).json({ err: 'Please login now' });

    console.log('rf_token', rf_token);
    console.log('REFRESH_TOKEN_SECRET', process.env.REFRESH_TOKEN_SECRET);

    const result = jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET);
    console.log('result', result);

    if (!result)
      return res
        .status(400)
        .json({ err: 'Please your token is incorrect or has expired.' });

    const user = await User.findById(result.id);
    if (!user) return res.status(400).json({ err: 'User does not exist.' });

    const access_token = createAccessToken({ id: user._id });
    res.json({
      access_token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        root: user.root,
      },
    });
  } catch (err) {
    return res.status(500).json({
      err: err.message,
    });
  }
}
