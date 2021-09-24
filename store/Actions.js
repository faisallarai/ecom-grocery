export const ACTIONS = {
  NOTIFY: 'NOTIFY',
  AUTH: 'AUTH',
  ADD_CART: 'ADD_CART',
  ADD_MODAL: 'ADD_MODAL',
  ADD_ORDERS: 'ADD_ORDERS',
};

export const addToCart = (product, cart) => {
  if (product.inStock === 0)
    return {
      type: 'NOTIFY',
      payload: { error: 'This product is out of stock.' },
    };

  const check = cart.every((item) => {
    return item._id !== product._id;
  });

  if (!check)
    return {
      type: 'NOTIFY',
      payload: { error: 'Th product has been added to cart.' },
    };

  console.log('ADD_CART');
  return { type: 'ADD_CART', payload: [...cart, { ...product, quantity: 1 }] };
};

export const decrease = (data, id) => {
  const newData = [...data];
  newData.forEach((item) => {
    if (item._id === id) item.quantity -= 1;
  });

  return { type: 'ADD_CART', payload: newData };
};

export const increase = (data, id) => {
  const newData = [...data];
  newData.forEach((item) => {
    if (item._id === id) item.quantity += 1;
  });

  return { type: 'ADD_CART', payload: newData };
};

export const deleteItem = (data, id, actionType) => {
  // return data without the item to be deleted
  const newData = data.filter((item) => item._id !== id);
  return { type: actionType, payload: newData };
};

export const updateItem = (data, id, post, actionType) => {
  // loop and update the item when found
  const newData = data.map((item) => (item._id === id ? post : item));
  return { type: actionType, payload: newData };
};
