/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { DataContext } from '../../store/GlobalState';
import Head from 'next/head';
import OrderDetail from '../../components/OrderDetail';

export default function DetailOrder() {
  const router = useRouter();

  const { state } = useContext(DataContext);
  const { orders } = state;

  const [orderDetail, setOrderDetail] = useState([]);

  useEffect(() => {
    if (!orders) return null;
    const newArr = orders.filter((order) => order._id === router.query.id);
    setOrderDetail(newArr);
  }, [orders]);

  return (
    <div className="my-3">
      <Head>
        <title>Detail Order</title>
      </Head>

      <div>
        <button className="btn btn-dark" onClick={() => router.back()}>
          <i className="fas fa-long-arrow-alt-left" aria-hidden="true"></i>Go
          Back
        </button>
      </div>

      <OrderDetail orderDetail={orderDetail} />
    </div>
  );
}
