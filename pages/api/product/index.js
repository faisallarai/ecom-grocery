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

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filtering() {
    const queryObj = { ...this.queryString };

    const excludeFields = ['page', 'sort', 'limit'];
    excludeFields.forEach((el) => delete queryObj[el]);

    // console.log('queryObj', queryObj);

    if (queryObj.category !== 'all')
      this.query.find({ category: queryObj.category });

    if (queryObj.search !== 'all')
      this.query.find({ name: { $regex: queryObj.search } });

    this.query.find();
    return this;
  }

  sorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 6;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

const getProducts = async (req, res) => {
  try {
    const features = new APIFeatures(Product.find(), req.query)
      .filtering()
      .sorting()
      .paginating();
    const products = await features.query;

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
