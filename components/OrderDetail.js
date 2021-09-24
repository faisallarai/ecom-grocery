/* eslint-disable @next/next/no-img-element */
import React from 'react';
import NextLink from 'next/link';
import Payment from './Payment';
import { patchData } from '../utils/fetchData';
import { updateItem } from '../store/Actions';

export default function OrderDetail({ orderDetail, state, dispatch }) {
  const { auth, orders } = state;

  const handleDelivered = (order) => {
    dispatch({ type: 'NOTIFY', payload: { loading: true } });
    patchData(`order/delivered/${order._id}`, null, auth.token).then((res) => {
      console.log('DELIVERED', res.result);
      if (res.err)
        return dispatch({ type: 'NOTIFY', payload: { error: res.err } });

      dispatch(
        updateItem(orders, order._id, { ...order, ...res.result }, 'ADD_ORDERS')
      );

      return dispatch({ type: 'NOTIFY', payload: { success: res.msg } });
    });
  };

  if (!auth.user) return null;

  return (
    <>
      {orderDetail.map((order) => (
        <div
          key={order._id}
          style={{ margin: '20px auto' }}
          className="row justify-content-around"
        >
          <div className="text-uppercase my-3" style={{ maxWidth: '600px' }}>
            <h2 className="text-break">Order {order._id}</h2>
            <div className="mt-4 text-secondary">
              <h3>Shipping</h3>
              <p>Name: {order.user.name}</p>
              <p>Email: {order.user.email}</p>
              <p>Address: {order.address}</p>
              <p>Mobile: {order.mobile}</p>

              <div
                className={`alert ${
                  order.isDelivered ? 'alert-success' : 'alert-danger'
                } d-flex justify-content-between align-items-center `}
                role="alert"
              >
                {order.isDelivered
                  ? `Delivered on ${order.deliveredAt}`
                  : 'Not Delivered'}

                {auth.user.role === 'admin' && !order.isDelivered && (
                  <button
                    className="btn btn-dark text-uppercase"
                    onClick={() => handleDelivered(order)}
                  >
                    Mark as delivered
                  </button>
                )}
              </div>

              <h3>Payment</h3>
              {order.paymentMethod && (
                <h6>
                  Payment Method: <em>{order.paymentMethod}</em>
                </h6>
              )}

              {order.paymentId && (
                <p>
                  PaymentId: <em>{order.paymentId}</em>
                </p>
              )}

              <div
                className={`alert ${
                  order.isPaid ? 'alert-success' : 'alert-danger'
                } d-flex justify-content-between align-items-center `}
                role="alert"
              >
                {order.isPaid ? `Paid on ${order.paidAt}` : 'Not Paid'}
              </div>

              <div>
                <h3>Order Items</h3>
                {order.cart.map((item) => (
                  <div
                    className="row border-bottom mx-0 p-2 justify-content-between align-items-center"
                    key={item._id}
                    style={{ maxWidth: '550px' }}
                  >
                    <div className="col">
                      <img
                        src={item.images[0].url}
                        alt={item.name}
                        style={{
                          width: '50px',
                          height: '45px',
                          objectFit: 'cover',
                        }}
                      />

                      <h5 className="flex-fill text-secondary px-3 m-0">
                        <NextLink href={`/product/${item._id}`}>
                          <a>{item.title}</a>
                        </NextLink>
                      </h5>
                    </div>

                    <div className="col">
                      <span className="text-info m-0">
                        {item.quantity} x GHS{item.price} ={' '}
                        {item.quantity * item.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {!order.isPaid && auth.user.role !== 'admin' && (
            <Payment order={order} />
          )}
        </div>
      ))}
    </>
  );
}
