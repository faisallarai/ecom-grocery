import { useContext, useState } from 'react';
import { getData } from '../utils/fetchData';
import Head from 'next/head';
import ProductItem from '../components/product/ProductItem';
import { DataContext } from '../store/GlobalState';

export default function Home(props) {
  const { state, dispatch } = useContext(DataContext);
  const { auth } = state;

  const [products, setProducts] = useState(props.products);
  const [isCheck, setIsCheck] = useState(false);

  const handleCheck = (id) => {
    products.forEach((product) => {
      if (product._id === id) product.checked = !product.checked;
    });
    setProducts([...products]);
  };

  const handleCheckAll = () => {
    products.forEach((product) => (product.checked = !isCheck));
    setProducts([...products]);
    setIsCheck(!isCheck);
  };

  const handleDeleteAll = () => {
    let deleteArr = [];
    products.forEach((product) => {
      if (product.checked) {
        deleteArr.push({
          data: '',
          id: product._id,
          title: 'Delete all selected products?',
          type: 'DELETE_PRODUCT',
        });
      }
    });

    dispatch({ type: 'ADD_MODAL', payload: deleteArr });
  };

  if (!products) return null;

  return (
    <div className="home_page">
      {auth.user && auth.user.role === 'admin' && (
        <div
          className="delete_all btn btn-danger mt-2"
          style={{ marginBottom: '-10px' }}
        >
          <input
            type="checkbox"
            checked={isCheck}
            onChange={handleCheckAll}
            style={{
              width: '25px',
              height: '25px',
              transform: 'translateY(8px)',
            }}
          />
          <button
            className="btn btn-danger ml-2"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            onClick={handleDeleteAll}
          >
            DELETE ALL
          </button>
        </div>
      )}
      <div className="products">
        <Head>
          <title>Grocery Home</title>
        </Head>

        {products.length === 0 ? (
          <h2>No Products</h2>
        ) : (
          products.map((product) => (
            <ProductItem
              key={product._id}
              product={product}
              handleCheck={handleCheck}
            />
          ))
        )}
      </div>
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
