/* eslint-disable @next/next/no-img-element */
import React from 'react';
import NextLink from 'next/link';
import Payment from './Payment';

export default function OrderDetail({ orderDetail }) {
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
              </div>

              <h3>Payment</h3>
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
          {!order.isPaid && <Payment order={order} />}
        </div>
      ))}
    </>
  );
}
