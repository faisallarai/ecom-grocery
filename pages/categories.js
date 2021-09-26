import React, { useContext, useState } from 'react';
import Head from 'next/head';
import { DataContext } from '../store/GlobalState';
import { postData, putData } from '../utils/fetchData';
import { updateItem } from '../store/Actions';

export default function Categories() {
  const { state, dispatch } = useContext(DataContext);
  const { auth, categories } = state;

  const [name, setName] = useState('');
  const [id, setId] = useState(0);

  const createCategory = async () => {
    if (auth.user.role !== 'admin')
      return dispatch({
        type: 'NOTIFY',
        payload: { error: 'Authentication is not valid.' },
      });

    if (!name)
      return dispatch({
        type: 'NOTIFY',
        payload: { error: 'Name cannot be left blank.' },
      });

    dispatch({ type: 'NOTIFY', payload: { loading: true } });

    let res;
    if (id) {
      res = await putData(`category/${id}`, { name }, auth.token);
      if (res.err)
        return dispatch({ type: 'NOTIFY', payload: { error: res.err } });

      dispatch(updateItem(categories, id, res.category, 'ADD_CATEGORIES'));
    } else {
      res = await postData('category', { name }, auth.token);
      if (res.err)
        return dispatch({ type: 'NOTIFY', payload: { error: res.err } });

      dispatch({
        type: 'ADD_CATEGORIES',
        payload: [...categories, res.newCategory],
      });
    }

    setName('');
    setId('');
    return dispatch({ type: 'NOTIFY', payload: { success: res.msg } });
  };

  const handleEditCategory = (category) => {
    setId(category._id);
    setName(category.name);
  };

  return (
    <div className="col-md-6 mx-auto my-3">
      <Head>
        <title>Categories</title>
      </Head>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Add a new category"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button className="btn btn-secondary mx-1" onClick={createCategory}>
          {id ? 'Update' : 'Create'}
        </button>
      </div>

      {categories.map((category) => (
        <div key={category._id} className="card my-2 text-capitalize">
          <div className="card-body d-flex justify-content-between">
            {category.name}

            <div style={{ cursor: 'pointer' }}>
              <i
                className="fas fa-edit mx-2 text-info"
                onClick={() => handleEditCategory(category)}
              ></i>
              <i
                className="fas fa-trash-alt mx-2 text-danger"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                onClick={() =>
                  dispatch({
                    type: 'ADD_MODAL',
                    payload: [
                      {
                        data: categories,
                        id: category._id,
                        title: category.name,
                        type: 'ADD_CATEGORIES',
                      },
                    ],
                  })
                }
              ></i>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
