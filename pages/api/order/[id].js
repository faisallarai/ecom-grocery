import auth from '../../../middleware/auth';
import Order from '../../../models/Order';
import db from '../../../utils/db';

db.connect();

export default async function handler(req, res) {
  switch (req.method) {
    case 'PATCH':
      await paymentOrder(req, res);
      break;
    default:
      res.status(400).json({ err: 'Invalid Method' });
  }
}

const paymentOrder = async (req, res) => {
  try {
    await auth(req, res);
    const { id } = req.query;

    await Order.findOneAndUpdate(
      { _id: id },
      {
        isPaid: true,
        paidAt: new Date().toISOString(),
      }
    );

    res.json({
      msg: 'Payment success!',
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
