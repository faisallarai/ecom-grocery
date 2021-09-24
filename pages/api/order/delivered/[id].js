import auth from '../../../../middleware/auth';
import Order from '../../../../models/Order';
import db from '../../../../utils/db';

db.connect();

export default async function handler(req, res) {
  switch (req.method) {
    case 'PATCH':
      await deliveredOrder(req, res);
      break;
    default:
      res.status(400).json({ err: 'Invalid Method' });
  }
}

const deliveredOrder = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (!result)
      return res.status(400).json({ err: 'Authentication is not valid.' });

    const { id } = req.query;
    const random = Math.floor(Math.random() * 1000000000);

    const order = await Order.findById(id);
    if (order.isPaid) {
      await Order.findOneAndUpdate(
        { _id: id },
        {
          isDelivered: true,
          deliveredAt: new Date().toISOString(),
        }
      );

      res.json({
        msg: 'Updated success!',
        result: {
          isPaid: order.isPaid,
          paidAt: order.paidAt,
          paymentMethod: order.paymentMethod,
          paymentId: order.paymentId,
          isDelivered: true,
          deliveredAt: new Date().toISOString(),
        },
      });
    } else {
      await Order.findByIdAndUpdate(id, {
        isPaid: true,
        paidAt: new Date().toISOString(),
        paymentMethod: 'Cash',
        paymentId: random,
        isDelivered: true,
        deliveredAt: new Date().toISOString(),
      });

      res.json({
        msg: 'Updated success!',
        result: {
          isPaid: true,
          paidAt: new Date().toISOString(),
          paymentMethod: 'Cash',
          paymentId: random,
          isDelivered: true,
          deliveredAt: new Date().toISOString(),
        },
      });
    }
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
