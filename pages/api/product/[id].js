import Product from '../../../models/Product';
import db from '../../../utils/db';
import auth from '../../../middleware/auth';

db.connect();

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      await getProduct(req, res);
      break;
    case 'PUT':
      await updateProduct(req, res);
      break;
  }
}

const getProduct = async (req, res) => {
  try {
    const { id } = req.query;

    const product = await Product.findById(id);
    if (!product)
      return res.status(400).json({ err: 'This product does not exist.' });

    res.json({
      product,
    });
  } catch (err) {
    return res.status(500).json({
      err: err.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (result.role !== 'admin')
      return res.status(400).json({ err: 'Authentication is not valid.' });

    const { id } = req.query;
    const { name, price, inStock, description, content, category, images } =
      req.body;

    if (
      !name ||
      !price ||
      !inStock ||
      !description ||
      !content ||
      category === 'all' ||
      images.length === 0
    )
      return res.status(400).json({ err: 'Please add all the fields.' });

    await Product.findByIdAndUpdate(id, {
      name,
      price,
      inStock,
      description,
      content,
      category,
      images,
    });

    res.json({
      msg: 'Success! Updated a product',
    });
  } catch (err) {
    return res.status(500).json({
      err: err.message,
    });
  }
};
