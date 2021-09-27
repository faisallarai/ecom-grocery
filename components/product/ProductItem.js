/* eslint-disable @next/next/no-img-element */
import React, { useContext } from 'react';
import NextLink from 'next/link';
import { DataContext } from '../../store/GlobalState';
import { addToCart } from '../../store/Actions';

export default function ProductItem({ product, handleCheck }) {
  const { state, dispatch } = useContext(DataContext);
  const { auth, cart } = state;

  const userLink = () => {
    return (
      <>
        <NextLink href={`/product/${product._id}`}>
          <a
            className="col btn btn-info"
            style={{ marginRight: '5px', flex: 1 }}
          >
            View
          </a>
        </NextLink>
        <button
          className="col btn btn-success"
          style={{ marginLeft: '5px', flex: 1 }}
          disabled={product.inStock === 0 ? true : false}
          onClick={() => dispatch(addToCart(product, cart))}
        >
          Buy
        </button>
      </>
    );
  };

  const adminLink = () => {
    return (
      <>
        <NextLink href={`/create/${product._id}`}>
          <a
            className="col btn btn-info"
            style={{ marginRight: '5px', flex: 1 }}
          >
            Edit
          </a>
        </NextLink>
        <button
          className="col btn btn-danger"
          style={{ marginLeft: '5px', flex: 1 }}
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          onClick={() =>
            dispatch({
              type: 'ADD_MODAL',
              payload: [
                {
                  data: '',
                  id: product._id,
                  title: product.name,
                  type: 'DELETE_PRODUCT',
                },
              ],
            })
          }
        >
          Delete
        </button>
      </>
    );
  };

  return (
    <div className="card text-capitalize" style={{ width: '18rem' }}>
      {auth.user && auth.user.role === 'admin' && (
        <input
          type="checkbox"
          checked={product.checked}
          className="position-absolute"
          style={{ height: '20px', width: '20px' }}
          onChange={() => handleCheck(product._id)}
        />
      )}
      <img
        src={product.images[0].url}
        className="card-img-top"
        alt={product.name}
      />
      <div className="card-body">
        <h5 className="card-title" title={product.name}>
          {product.name}
        </h5>
        <div className="row d-flex justify-content-between">
          <h6 className="col text-danger">GHC{product.price}</h6>
          {product.inStock > 0 ? (
            <h6 className="col text-danger">In Stock: {product.inStock}</h6>
          ) : (
            <h6 className="col text-danger">Out Stock</h6>
          )}
        </div>
        <p className="card-text" title={product.description}>
          {product.description}
        </p>
        <div className="row d-flex justify-content-between mx-0">
          {!auth.user || auth.user.role !== 'admin' ? userLink() : adminLink()}
        </div>
      </div>
    </div>
  );
}
