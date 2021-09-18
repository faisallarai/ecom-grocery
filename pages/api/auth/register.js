import db from '../../../utils/db';
import User from '../../../models/User';
import bycrpt from 'bcryptjs';
import valid from '../../../utils/valid';

db.connect();

export default async function handler(req, res) {
  switch (req.method) {
    case 'POST':
      await register(req, res);
      break;
  }
}

const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    const errMsg = valid(name, email, password, confirmPassword);
    if (errMsg) return res.status(400).json({ err: errMsg });

    const user = await User.findOne({ email });
    if (user)
      return res.status(400).json({ err: 'This email already exists.' });

    const passwordHash = bycrpt.hashSync(password, 12);

    const newUser = new User({
      name,
      email,
      password: passwordHash,
      confirmPassword,
    });

    await newUser.save();

    res.json({
      message: 'Register success',
    });
  } catch (err) {
    return res.status(500).json({
      err: err.message,
    });
  }
};
