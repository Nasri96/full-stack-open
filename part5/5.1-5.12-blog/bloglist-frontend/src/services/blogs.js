import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async(blog, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  try {
    const response = await axios.post(baseUrl, blog, config);
    return response.data;
  } catch(error) {
    throw "invalid form inputs";
  }
}

const update = async(blog) => {
  try {
    const response = await axios.put(`${baseUrl}/${blog.id}`, blog);
    return response.data;
  } catch(error) {
    throw "invalid form inputs";
  }
}

const deleteBlog = async(id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  try {
    const response = await axios.delete(`${baseUrl}/${id}`, config);
    return "blog deleted";
  } catch(error) {
    console.dir(error);
    return Promise.reject(error.response.data.error);
  }
}

export default { getAll, create, update, deleteBlog }