/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Head from 'next/head';
import NextLink from 'next/link';

export default function Signin() {
  return (
    <div>
      <Head>
        <title>Signin</title>
      </Head>
      <form className="mx-auto my-4" style={{ maxWidth: '500px' }}>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
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
          />
        </div>

        <button type="submit" className="btn btn-dark w-100">
          Login Now
        </button>
        <p className="my-3">
          You don't have an account?{' '}
          <NextLink href="/register" passHref>
            <a style={{ color: 'crimson' }}>Register Now</a>
          </NextLink>
        </p>
      </form>
    </div>
  );
}
