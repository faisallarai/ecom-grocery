import auth from '../../../middleware/auth';
import db from '../../../utils/db';
import Category from '../../../models/Category';

db.connect();

export default async function handler(req, res) {
  switch (req.method) {
    case 'POST':
      await createCategory(req, res);
      break;
    case 'GET':
      await getCategories(req, res);
      break;
    default:
      res.status(400).json({ err: 'Invalid Method' });
  }
}

const createCategory = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (result.role !== 'admin' || !result.root)
      return res.status(400).json({ err: 'Authentication is not valid.' });

    const { name } = req.body;
    if (!name)
      return res.status(400).json({ err: 'Name canot be left blank.' });

    const newCategory = new Category({
      name,
    });

    await newCategory.save();

    res.json({
      msg: 'Success! Created a new category.',
      newCategory,
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (result.role !== 'admin' || !result.root)
      return res.status(400).json({ err: 'Authentication is not valid' });

    const categories = await Category.find();
    res.json({ categories });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
