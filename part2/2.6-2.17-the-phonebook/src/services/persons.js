import axios from "axios";

const url = "http://localhost:3001/persons";

const getPersons = () => {
    return axios
      .get(url)
      .then(response => {
        return response.data;
      })
}

const createPerson = newPerson => {
    return axios
        .post(url, newPerson)
        .then(response => {
            return response.data;
        })
}

const deletePerson = id => {
    return axios.delete(`${url}/${id}`)
    .then(response => {
        return response.data;
    })
} 

const updatePerson = (id, changedPerson) => {
    return axios
        .put(`${url}/${id}`, changedPerson)
        .then(response => {
            return response.data;
        })
}


export default {
    getPersons,
    createPerson,
    deletePerson,
    updatePerson
}