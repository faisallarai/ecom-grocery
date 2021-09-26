/* eslint-disable @next/next/no-img-element */
import React, { useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import { DataContext } from '../../store/GlobalState';
import { imageUpload } from '../../utils/imageUpload';
import { getData, postData, putData } from '../../utils/fetchData';
import { useRouter } from 'next/router';

export default function ProductsManager() {
  const initialState = {
    code: '',
    name: '',
    price: 0,
    inStock: 0,
    description: '',
    content: '',
    category: '',
  };

  const [product, setProduct] = useState(initialState);
  const { code, name, price, inStock, description, content, category } =
    product;

  const [images, setImages] = useState([]);

  const { state, dispatch } = useContext(DataContext);
  const { auth, categories } = state;

  const router = useRouter();
  const { id } = router.query;

  const [onEdit, setOnEdit] = useState(false);

  useEffect(() => {
    if (id) {
      setOnEdit(true);
      getData(`product/${id}`).then((res) => {
        if (res.err)
          return dispatch({ type: 'NOTIFY', payload: { error: res.err } });

        setProduct(res.product);
        setImages(res.product.images);
      });
    } else {
      setOnEdit(false);
      setProduct(initialState);
      setImages([]);
    }
  }, [id]);

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
    dispatch({ type: 'NOTIFY', payload: {} });
  };

  const handleUploadInput = (e) => {
    dispatch({ type: 'NOTIFY', payload: {} });
    let newImages = [];
    let num = 0;
    let err = '';
    const files = [...e.target.files];

    if (files.length === 0)
      return dispatch({
        type: 'NOTIFY',
        payload: { error: 'Files does not exist.' },
      });

    files.forEach((file) => {
      if (file.size > 1024 * 1024)
        return (err = 'The largest image size is 1mb.');

      if (file.type !== 'image/jpeg' && file.type !== 'image/png')
        return (err = 'Image format is incorrect.');

      num += 1;
      if (num <= 5) newImages.push(file);

      return newImages;
    });

    if (err) return dispatch({ type: 'NOTIFY', payload: { error: err } });

    const imgCount = images.length;
    if (imgCount + newImages.length > 5)
      return dispatch({
        type: 'NOTIFY',
        payload: { error: 'Select up to 5 images.' },
      });

    setImages([...images, ...newImages]);
  };

  const deleteImage = (index) => {
    const newArr = [...images];
    newArr.splice(index, 1);
    setImages(newArr);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (auth.user.role !== 'admin')
      return dispatch({
        type: 'NOTIFY',
        payload: { err: 'Authentication is not valid.' },
      });

    if (
      !code ||
      !name ||
      !price ||
      !inStock ||
      !description ||
      !content ||
      category === 'all' ||
      images.length === 0
    )
      return dispatch({
        type: 'NOTIFY',
        payload: { err: 'Please add all the fields.' },
      });

    dispatch({ type: 'NOTIFY', payload: { loading: true } });

    let media = [];
    const imgNewURL = images.filter((img) => !img.url);
    const imgOldURL = images.filter((img) => img.url);

    if (imgNewURL.length > 0) media = await imageUpload(imgNewURL);

    let res;
    if (onEdit) {
      res = await putData(
        `product/${id}`,
        {
          ...product,
          images: [...imgOldURL, ...media],
        },
        auth.token
      );
    } else {
      res = await postData(
        'product',
        { ...product, images: [...imgOldURL, ...media] },
        auth.token
      );
    }

    if (res.err)
      return dispatch({ type: 'NOTIFY', payload: { error: res.err } });

    return dispatch({ type: 'NOTIFY', payload: { success: res.msg } });
  };

  return (
    <div className="products_manager">
      <Head>
        <title>Products Manager</title>
      </Head>

      <form className="row" onSubmit={handleSubmit}>
        <div className="col-md-6">
          <input
            type="text"
            name="code"
            value={code}
            placeholder="Product Code"
            className="d-block my-4 w-100 p-2"
            onChange={handleChangeInput}
            disabled={onEdit ? true : false}
          />

          <input
            type="text"
            name="name"
            value={name}
            placeholder="Product Name"
            className="d-block my-4 w-100 p-2"
            onChange={handleChangeInput}
          />

          <div className="row">
            <div className="col-sm-6">
              <label htmlFor="price">Price</label>

              <input
                type="number"
                name="price"
                value={price}
                placeholder="Price"
                className="d-block w-100 p-2"
                onChange={handleChangeInput}
              />
            </div>
            <div className="col-sm-6">
              <label htmlFor="inStock">In Stock</label>
              <input
                type="number"
                name="inStock"
                value={inStock}
                placeholder="In Stock"
                className="d-block w-100 p-2"
                onChange={handleChangeInput}
              />
            </div>
          </div>

          <textarea
            name="description"
            id="description"
            cols="30"
            rows="4"
            placeholder="Description"
            onChange={handleChangeInput}
            className="d-block my-4 w-100 p-2"
            value={description}
          />

          <textarea
            name="content"
            id="content"
            cols="30"
            rows="6"
            placeholder="Content"
            onChange={handleChangeInput}
            className="d-block my-4 w-100 p-2"
            value={content}
          />

          <div className="input-group-prepend px-0 my-2">
            <select
              name="category"
              id="category"
              value={category}
              onChange={handleChangeInput}
              className="form-select text-capitalize"
            >
              <option value="All Products"></option>
              {categories.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-info my-2 px-4 mx-0">
            {onEdit ? 'Update' : 'Create'}
          </button>
        </div>
        <div className="col-md-6 my-4">
          <div className="input-group mb-3">
            <label className="input-group-text" htmlFor="inputGroupFile01">
              Upload
            </label>
            <input
              type="file"
              className="form-control"
              id="inputGroupFile01"
              onChange={handleUploadInput}
              multiple
              accept="image/*"
            />
          </div>

          <div className="row img-up mx-0">
            {images.map((img, index) => (
              <div key={index} className="file_img my-1">
                <img
                  src={img.url ? img.url : URL.createObjectURL(img)}
                  alt=""
                  className="img-thumbnail rounded"
                />

                <span onClick={() => deleteImage(index)}>X</span>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}
