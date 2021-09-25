import auth from '../../../middleware/auth';
import db from '../../../utils/db';
import User from '../../../models/User';

db.connect();

export default async function handler(req, res) {
  switch (req.method) {
    case 'PATCH':
      await updateRole(req, res);
      break;
    case 'DELETE':
      await deleteUser(req, res);
      break;
    default:
      res.status(400).json({ err: 'Invalid Method' });
  }
}

const updateRole = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (result.role !== 'admin' || !result.root)
      return res.status(400).json({ err: 'Authentication is not valid.' });

    const { id } = req.query;
    const { role } = req.body;

    await User.findByIdAndUpdate(id, {
      role,
    });

    res.json({ msg: 'Update success!' });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (result.role !== 'admin' || !result.root)
      return res.status(400).json({ err: 'Authentication is not valid.' });

    const { id } = req.query;

    await User.findByIdAndDelete(id);

    res.json({ msg: 'Deleted success!' });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
