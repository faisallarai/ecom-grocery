import auth from '../../../../middleware/auth';
import Order from '../../../../models/Order';
import db from '../../../../utils/db';
import { getExternalData } from '../../../../utils/fetchData';

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
    const result = await auth(req, res);
    if (result.role === 'user') {
      const { id } = req.query;
      const { transactionId } = req.body;
      const payment = await verifyPayment(transactionId);

      await Order.findOneAndUpdate(
        { _id: id },
        {
          isPaid: true,
          paidAt: payment.data.created_at,
          paymentId: payment.data.flw_ref,
          paymentMethod: payment.data.payment_type,
        }
      );

      res.json({
        msg: 'Payment success!',
        payment,
      });
    }
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const verifyPayment = async (transactionId) => {
  const result = await getExternalData(
    `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
    process.env.WAVE_BEARER_KEY
  );
  return result;
};
