import React from 'react';
import Product from '../../../models/Product';
import db from '../../../utils/db';

db.connect();

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      await getProducts(req, res);
      break;
  }
}

const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json({
      status: 'success',
      result: products.length,
      products,
    });
  } catch (err) {
    return res.status(500).json({
      err: err.message,
    });
  }
};
