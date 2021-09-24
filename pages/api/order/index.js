import auth from '../../../middleware/auth';
import Order from '../../../models/Order';
import Product from '../../../models/Product';
import db from '../../../utils/db';

db.connect();

export default async function handler(req, res) {
  switch (req.method) {
    case 'POST':
      await createOrder(req, res);
      break;
    case 'GET':
      await getOrders(req, res);
      break;
    default:
      res.status(400).json({ err: 'Invalid Method' });
  }
}

const createOrder = async (req, res) => {
  try {
    const result = await auth(req, res);
    const { address, mobile, cart, total } = req.body;

    const newOrder = new Order({
      user: result.id,
      address,
      mobile,
      cart,
      total,
    });

    cart.filter((item) => {
      return sold(item._id, item.quantity, item.inStock, item.sold);
    });

    await newOrder.save();

    res.json({
      msg: 'Order success!, we will contact you to confirm the order.',
      newOrder,
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const result = await auth(req, res);

    let orders;
    if (result.role !== 'admin') {
      orders = await Order.find({ user: result.id }).populate(
        'user',
        '-password'
      );
    } else {
      orders = await Order.find().populate('user', '-password');
    }

    res.json({
      orders,
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const sold = async (id, quantity, oldInStock, oldSold) => {
  await Product.findOneAndUpdate(
    { _id: id },
    {
      inStock: oldInStock - quantity,
      sold: quantity + oldSold,
    }
  );
};
