import auth from '../../../middleware/auth';
import Product from '../../../models/Product';
import db from '../../../utils/db';

db.connect();

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      await getProducts(req, res);
      break;
    case 'POST':
      await createProduct(req, res);
      break;
  }
}

const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json({
      status: 'success',
      result: products.length,
      products,
    });
  } catch (err) {
    return res.status(500).json({
      err: err.message,
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (result.role !== 'admin')
      return res.status(400).json({ err: 'Authentication is not valid.' });

    const {
      code,
      name,
      price,
      inStock,
      description,
      content,
      category,
      images,
    } = req.body;

    if (
      !code ||
      !name ||
      !price ||
      !inStock ||
      !description ||
      !content ||
      category === 'all' ||
      images.length === 0
    )
      return res.status(400).json({ err: 'Please add all the fields.' });

    const product = await Product.findOne({ code });
    if (product)
      return res.status(400).json({ err: 'This product already exists.' });

    const newProduct = new Product({
      code,
      name: name.toLowerCase(),
      price,
      inStock,
      description,
      content,
      category,
      images,
    });

    await newProduct.save();

    res.json({ msg: 'Success! Create a new product.' });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
