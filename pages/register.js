/* eslint-disable react/no-unescaped-entities */
import React, { useContext, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import valid from '../utils/valid';
import { DataContext } from '../store/GlobalState';
import { postData } from '../utils/fetchData';

export default function Register() {
  const initialState = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };
  const [userData, setUserData] = useState(initialState);
  const { name, email, password, confirmPassword } = userData;

  const { dispatch } = useContext(DataContext);

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    dispatch({ type: 'NOTIFY', payload: {} });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errMsg = valid(name, email, password, confirmPassword);

    if (errMsg) return dispatch({ type: 'NOTIFY', payload: { error: errMsg } });

    dispatch({ type: 'NOTIFY', payload: { loading: true } });

    const res = await postData('auth/register', userData);

    console.log(res);
    if (res.err)
      return dispatch({ type: 'NOTIFY', payload: { error: res.err } });

    return dispatch({ type: 'NOTIFY', payload: { success: res.message } });
  };

  return (
    <div>
      <Head>
        <title>Register</title>
      </Head>
      <form
        className="mx-auto my-4"
        style={{ maxWidth: '500px' }}
        onSubmit={handleSubmit}
      >
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={name}
            onChange={handleChangeInput}
          />
        </div>
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
        <div className="mb-3">
          <label htmlFor="exampleInputPassword2" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword2"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleChangeInput}
          />
        </div>

        <button type="submit" className="btn btn-dark w-100">
          Register Now
        </button>
        <p className="my-2">
          Already have an account?{' '}
          <NextLink href="/signin" passHref>
            <a style={{ color: 'crimson' }}>Login Now</a>
          </NextLink>
        </p>
      </form>
    </div>
  );
}
