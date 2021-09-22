import { useState } from 'react';
import { getData } from '../utils/fetchData';
import Head from 'next/head';
import ProductItem from '../components/product/ProductItem';

export default function Home(props) {
  const [products] = useState(props.products);

  console.log(products);

  if (!products) return null;

  return (
    <div className="products">
      <Head>
        <title>Grocery Home</title>
      </Head>

      {products.length === 0 ? (
        <h2>No Products</h2>
      ) : (
        products.map((product) => (
          <ProductItem key={product._id} product={product} />
        ))
      )}
    </div>
  );
}

export async function getServerSideProps() {
  const res = await getData('product');
  if (!res.products) {
    return {
      notFound: true,
    };
  }

  // server side rendering
  return {
    props: {
      products: res.products,
      result: res.result,
    },
  };
}
