import { connect } from '../../utils/db';
import Product from '../../models/Product';
import { data } from '../../utils/data';
import User from '../../models/User';

connect();

export default async function handler(req, res) {
  try {
    await User.deleteMany();
    await User.insertMany(data.users);
    await Product.deleteMany();
    await Product.insertMany(data.products);
    res.json({
      msg: 'Seeded successfully',
    });
  } catch (err) {
    return res.status(500).json({
      err: err.message,
    });
  }
}
