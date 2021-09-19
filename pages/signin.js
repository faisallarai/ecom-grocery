/* eslint-disable react/no-unescaped-entities */
import React, { useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { DataContext } from '../store/GlobalState';
import { postData } from '../utils/fetchData';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

export default function Signin() {
  const initialState = {
    email: '',
    password: '',
  };
  const [userData, setUserData] = useState(initialState);
  const { email, password } = userData;

  const [state, dispatch] = useContext(DataContext);
  const { auth } = state;

  const router = useRouter();

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    dispatch({ type: 'NOTIFY', payload: {} });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch({ type: 'NOTIFY', payload: { loading: true } });

    const res = await postData('auth/login', userData);

    if (res.err)
      return dispatch({ type: 'NOTIFY', payload: { error: res.err } });

    dispatch({ type: 'NOTIFY', payload: { success: res.msg } });

    dispatch({
      type: 'AUTH',
      payload: { token: res.access_token, user: res.user },
    });

    Cookies.set('refreshToken', res.refresh_token, {
      path: 'api/auth/accessToken',
      expires: 7,
    });

    localStorage.setItem('firstLogin', true);
  };

  useEffect(() => {
    if (Object.keys(auth).length !== 0) router.push('/');
  });

  return (
    <div>
      <Head>
        <title>Login</title>
      </Head>
      <form
        className="mx-auto my-4"
        style={{ maxWidth: '500px' }}
        onSubmit={handleSubmit}
      >
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            name="email"
            value={email}
            onChange={handleChangeInput}
          />
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            name="password"
            value={password}
            onChange={handleChangeInput}
          />
        </div>

        <button type="submit" className="btn btn-dark w-100">
          Login Now
        </button>
        <p className="my-2">
          You don't have an account?{' '}
          <NextLink href="/register" passHref>
            <a style={{ color: 'crimson' }}>Register Now</a>
          </NextLink>
        </p>
      </form>
    </div>
  );
}
