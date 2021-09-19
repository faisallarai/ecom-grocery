import { getData } from '../utils/fetchData';

export default function Home(props) {
  return <div>Home</div>;
}

export async function getServerSideProps() {
  const res = await getData('product');

  // server side rendering
  return {
    props: {
      products: res.products,
      result: res.result,
    },
  };
}
