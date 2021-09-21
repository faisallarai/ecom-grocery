/* eslint-disable no-undef */
import { useRouter } from 'next/dist/client/router';
import React, { useEffect, useRef } from 'react';

export default function WaveBtn({ total, address, mobile, state, dispatch }) {
  // ref can be used when working with paypal
  const refRaveBtn = useRef();
  const router = useRouter();
  const { cart, auth } = state;

  useEffect(() => {
    if (!auth) return router.push('/login');
    const makePayment = () => {
      FlutterwaveCheckout({
        public_key: process.env.WAVE_PUBLIC_KEY,
        tx_ref: 'RX1',
        amount: total,
        currency: 'USD',
        country: 'US',
        payment_options: ' ',
        // specified redirect URL
        redirect_url: '',
        meta: {
          consumer_id: 23,
          consumer_mac: '92a3-912ba-1192a',
          address: address,
        },
        customer: {
          email: auth.user.email,
          phone_number: mobile,
          name: auth.user.name,
        },
        callback: function (data) {
          console.log(data);
        },
        onclose: function () {
          // close modal
        },
        customizations: {
          title: 'My store',
          description: 'Payment for items in cart',
          logo: 'https://assets.piedpiper.com/logo.png',
        },
      });
    };
    makePayment();
  }, []);

  return <div ref={refRaveBtn}></div>;
}
