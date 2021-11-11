import axios from 'axios'

const baseUrl = 'api/persons'

const get = () => {
    const response = axios.get(baseUrl)
    return response.then(promise => promise.data)
}

const post = (newPerson) => {
    const response = axios.post(baseUrl, newPerson)
    return response.then(promise => promise.data)
}

const put = (person) => {
    const response = axios.put(`${baseUrl}/${person.id}`, person)
    return response.then(promise => promise.data)
}

const del = (id) => {
    return axios.delete(`${baseUrl}/${id}`)
}

const contactServices = {
    get,
    post,
    put,
    del
}

export default contactServices