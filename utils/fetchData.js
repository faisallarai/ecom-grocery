const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const getHeaders = (token) => {
  let headers = {};

  if (token) {
    headers = {
      'Content-Type': 'application/json',
      Authorization: token,
    };
  } else {
    headers = {
      'Content-Type': 'application/json',
    };
  }

  return headers;
};
export const getData = async (url, token) => {
  console.log(getHeaders(token));

  const res = await fetch(`${baseUrl}/api/${url}`, {
    method: 'GET',
    headers: getHeaders(token),
  });

  const data = await res.json();
  return data;
};

export const postData = async (url, post, token) => {
  const res = await fetch(`${baseUrl}/api/${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify(post),
  });

  const data = await res.json();
  return data;
};

export const putData = async (url, post, token) => {
  const res = await fetch(`${baseUrl}/api/${url}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify(post),
  });

  const data = await res.json();
  return data;
};

export const patchData = async (url, post, token) => {
  const res = await fetch(`${baseUrl}/api/${url}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify(post),
  });

  const data = await res.json();
  return data;
};

export const deleteData = async (url, token) => {
  const res = await fetch(`${baseUrl}/api/${url}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
  });

  const data = await res.json();
  return data;
};

export const getExternalData = async (url, token) => {
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
  });

  const data = res.json();
  return data;
};
