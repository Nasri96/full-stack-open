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

export default { getAll, create }