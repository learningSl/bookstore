import {http1,http} from './index'

export const userLogin = ()=>http1.get('/userLogin')

export const login = (params)=>http1.post('/login',params)

export const register = (params)=>http1.post('/register',params)

export const getUserInfo = (params)=>http.post('/getUserInfo',params)

export const updateUserInfo = (params)=>http.post('/updateUserInfo',params)

export const uploadImg = (params)=>http.post('/uploadImg',params)

export const getSwipper = ()=>http1.get('/getSwipper')

export const getShouyeSort = ()=>http1.get('/getShouyeSort')
export const getmiddleSwipper = ()=>http1.get('/getmiddleSwipper')


export const todaySuggestBook = ()=>http1.get('/todaySuggestBook')

export const getShouyeOrder = (params)=>http1.post('/getShouyeOrder',params)

export const getAllTodayBook = ()=>http1.get('/getAllTodayBook')

export const addCart = (params)=>http.post('/addcart',params)
export const bookCollect = (params)=>http.post('/bookCollect',params)
export const getCart = (params)=>http.post('/cart',params)

export const changeCount = (params)=>http.post('/changeCount',params)
export const removeCartBook = (params)=>http.post('/removeBook',params)
export const searchBook = (params)=>http1.post('/searchBook',params)
export const getCollect = (params)=>http.post('/getCollect',params)


