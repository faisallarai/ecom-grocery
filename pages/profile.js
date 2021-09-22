/* eslint-disable @next/next/no-img-element */
import React, { useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import { DataContext } from '../store/GlobalState';
import valid from '../utils/valid';
import { patchData } from '../utils/fetchData';

export default function Profile() {
  const { state, dispatch } = useContext(DataContext);
  const { auth, notify } = state;

  const initialState = {
    avatar: '',
    name: '',
    password: '',
    confirmPassword: '',
  };

  const [data, setData] = useState(initialState);
  const { avatar, name, password, confirmPassword } = data;

  useEffect(() => {
    if (auth.user) setData({ ...data, name: auth.user.name });
  }, [auth.user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    dispatch({ type: 'NOTIFY', payload: {} });
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    if (password) {
      const errMsg = valid(name, auth.user.email, password, confirmPassword);
      if (errMsg)
        return dispatch({ type: 'NOTIFY', payload: { error: errMsg } });
      updatePassword();
    }
  };

  const updatePassword = () => {
    dispatch({ type: 'NOTIFY', payload: { loading: true } });
    patchData('user/resetPassword', { password }, auth.token).then((res) => {
      if (res.err)
        return dispatch({ type: 'NOTIFY', payload: { error: res.err } });
      dispatch({ type: 'NOTIFY', payload: { success: res.msg } });
    });
  };

  if (!auth.user) return null;

  return (
    <div className="profile_page">
      <Head>
        <title>Profile</title>
      </Head>
      <section className="row text-secondary my-3">
        <div className="col-md-4">
          <h3 className="text-center text-uppercase">
            {auth.user.role === 'user' ? 'User Profile' : 'Admin Profile'}
          </h3>
          <div className="avatar">
            <img src={auth.user.avatar} alt={auth.user.avatar} />
            <span>
              <i className="fas fa-camera"></i>
              <p>Change</p>
              <input type="file" name="file" id="file_up" />
            </span>
          </div>

          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={handleChange}
              className="form-control"
              placeholder="Your name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              name="email"
              defaultValue={auth.user.email}
              disabled={true}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              className="form-control"
              placeholder="Your new password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              className="form-control"
              placeholder="Confirm new password"
            />
          </div>

          <button
            className="btn btn-info my-2"
            disabled={notify.loading}
            onClick={handleUpdateProfile}
          >
            Update
          </button>
        </div>

        <div className="col-md-8">
          <h3>Orders</h3>
        </div>
      </section>
    </div>
  );
}
