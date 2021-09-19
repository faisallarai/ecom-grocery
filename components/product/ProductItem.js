/* eslint-disable @next/next/no-img-element */
import React from 'react';
import NextLink from 'next/link';

export default function ProductItem({ product }) {
  const userLink = () => {
    return (
      <>
        <NextLink href={`/product/${product._id}`}>
          <a
            className="col btn btn-info mr-1"
            style={{ marginRight: '5px', flex: 1 }}
          >
            View
          </a>
        </NextLink>
        <button
          className="col btn btn-success ml-1"
          style={{ marginLeft: '5px', flex: 1 }}
        >
          Buy
        </button>
      </>
    );
  };
  return (
    <div className="card" style={{ width: '18rem' }}>
      <img
        src={product.images[0].url}
        className="card-img-top"
        alt={product.name}
      />
      <div className="card-body">
        <h5 className="card-title" title={product.title}>
          {product.title}
        </h5>
        <div className="row d-flex justify-content-between mx-0">
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
          {userLink()}
        </div>
      </div>
    </div>
  );
}
