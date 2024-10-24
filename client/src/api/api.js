import axios from 'axios'
const local = 'http://localhost:8000'
const production = ''
const api = axios.create({
    baseURL: `${local}/api`,
    withCredentials : true
})
export default api