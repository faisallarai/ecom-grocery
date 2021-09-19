/* eslint-disable @next/next/no-img-element */
import React, { useContext } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { DataContext } from '../store/GlobalState';
import Cookies from 'js-cookie';

function NavBar() {
  const router = useRouter();
  const [state, dispatch] = useContext(DataContext);
  const { auth } = state;

  const isActive = (r) => {
    if (r === router.pathname) {
      return ' active';
    } else {
      return '';
    }
  };

  const handleLogout = () => {
    Cookies.remove('refreshToken', { path: 'api/auth/accessToken' });
    localStorage.removeItem('firstLogin');
    dispatch({ type: 'AUTH', payload: {} });
    dispatch({ type: 'NOTIFY', payload: { success: 'Logged Out!' } });
  };

  const loggedRouter = () => {
    return (
      <li className="nav-item dropdown">
        <a
          className="nav-link dropdown-toggle"
          href="#"
          id="navbarDropdownMenuLink"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <img
            src={auth.user.avatar}
            alt={auth.user.avatar}
            style={{
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              transform: 'translateY(-3px)',
              marginRight: '3px',
            }}
          />
          {auth.user.name}
        </a>

        <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
          <li>
            <a className="dropdown-item" href="#">
              Profile
            </a>
          </li>
          <li>
            <button className="dropdown-item" onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </li>
    );
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <NextLink href="/">
          <a className="navbar-brand" href="#">
            Grocery
          </a>
        </NextLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarNavDropdown"
        >
          <ul className="navbar-nav">
            <li className="nav-item">
              <NextLink href="/cart">
                <a
                  className={'nav-link' + isActive('/cart')}
                  aria-current="page"
                  href="#"
                >
                  <i className="fas fa-shopping-cart" aria-hidden="true"></i>
                  Cart
                </a>
              </NextLink>
            </li>
            {Object.keys(auth).length === 0 ? (
              <li className="nav-item">
                <NextLink href="/signin">
                  <a
                    className={'nav-link' + isActive('/signin')}
                    aria-current="page"
                    href="#"
                  >
                    <i className="fas fa-user" aria-hidden="true"></i>Sign in
                  </a>
                </NextLink>
              </li>
            ) : (
              loggedRouter()
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
