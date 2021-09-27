import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import filterSearch from '../utils/filterSearch';

export default function Filter({ state }) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [category, setCategory] = useState('');

  const router = useRouter();

  const { categories } = state;

  const handleCategory = (e) => {
    setCategory(e.target.value);
    filterSearch({ router, category: e.target.value });
  };

  const handleSort = (e) => {
    setSort(e.target.value);
    filterSearch({ router, sort: e.target.value });
  };

  useEffect(() => {
    // console.log(search);
    filterSearch({ router, search: search ? search.toLowerCase() : 'all' });
  }, [search]);

  return (
    <div className="input-group">
      <div className="input-group-prepend col-md-2 px-0 mt-2">
        <select
          name="category"
          id="category"
          value={category}
          onChange={handleCategory}
          className="form-select text-capitalize"
        >
          <option value="all">All Products</option>
          {categories.map((item) => (
            <option key={item._id} value={item._id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <form autoComplete="off" className="mt-2 col-md-8 px-0">
        <input
          type="text"
          className="form-control"
          list="product_name"
          value={search.toLowerCase()}
          onChange={(e) => setSearch(e.target.value)}
        />

        <datalist id="product_name">
          <option value="name">Product Name</option>
        </datalist>

        <button
          type="submit"
          className="position-absolute btn btn-info mt-2"
          style={{ top: 0, right: '65px', visibility: 'hidden' }}
        >
          Search
        </button>
      </form>

      <div className="input-group-prepend col-md-2 px-0 mt-2">
        <select
          name="sort"
          id="sort"
          value={sort}
          onChange={handleSort}
          className="form-select text-capitalize"
        >
          <option value="-createdAt">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="-sold">Best Sales</option>
          <option value="-price">Price: High-Low</option>
          <option value="price">Price: Low-High</option>
        </select>
      </div>
    </div>
  );
}
