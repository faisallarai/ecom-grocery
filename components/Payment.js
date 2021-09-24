import { closePaymentModal, FlutterWaveButton } from 'flutterwave-react-v3';
import React, { useContext } from 'react';
import { updateItem } from '../store/Actions';
import { DataContext } from '../store/GlobalState';
import { patchData } from '../utils/fetchData';

export default function Payment({ order }) {
  const { state, dispatch } = useContext(DataContext);
  const { auth, orders } = state;

  const config = {
    public_key: process.env.WAVE_PUBLIC_KEY,
    tx_ref: Date.now() + Math.floor(Math.random() * 10),
    amount: order.total,
    currency: 'GHS',
    country: 'GH',
    payment_options: 'card,mobilemoney,ussd',
    meta: {
      consumer_id: order.user._id,
      consumer_mac: '92a3-912ba-1192a',
      address: order.address,
    },
    customer: {
      email: order.user.email,
      phone_number: order.mobile,
      name: order.user.name,
    },
    customizations: {
      title: 'Grocery Shop',
      description: 'Payment for items in cart',
      logo: 'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg',
    },
  };

  const fwConfig = {
    ...config,
    text: 'Pay now!',
    callback: (response) => {
      console.log(response);
      dispatch({ type: 'NOTIFY', payload: { loading: true } });
      patchData(
        `order/payment/${order._id}`,
        { transactionId: response.transaction_id },
        auth.token
      ).then((res) => {
        console.log('PAYMENT', res);
        if (res.err)
          return dispatch({
            type: 'NOTIFY',
            payload: { error: res.err },
          });

        dispatch(
          updateItem(
            orders,
            order._id,
            {
              ...order,
              isPaid: true,
              paidAt: res.payment.data.created_at,
              paymentMethod: res.payment.data.payment_type,
              paymentId: res.payment.data.flw_ref,
            },
            'ADD_ORDERS'
          )
        );

        dispatch({ type: 'NOTIFY', payload: { success: res.msg } });
      });
      closePaymentModal(); // this will close the modal programmatically
    },
    onClose: () => {},
  };

  return (
    <div className="col p-4">
      <h2 className="mb-4 text-uppercase">Total: GHS{order.total}</h2>
      <FlutterWaveButton className="btn btn-warning my-2 w-100" {...fwConfig} />
    </div>
  );
}
