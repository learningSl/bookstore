import axios from 'axios'

export const http1 = axios.create({
    baseURL: 'http://192.168.140.1:3000',
    timeout: 5000
})
export const http = axios.create({
    baseURL: 'http://192.168.140.1:3000/bookstore',
    timeout: 5000
})

http.interceptors.request.use(config=>{
    config.headers.token = localStorage.getItem('token')
    return config
})