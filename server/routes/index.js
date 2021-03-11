const jwt = require('jsonwebtoken')
const router = require('express').Router();
const { getConnect, insertOne, find, connect } = require('../database/index')
const objectId = require('mongodb').ObjectId;
const svg = require('svg-captcha')
const multer = require('multer')
let routes = app => {
    const key = 'hello,world!!!'
    router.get('/test', (req, res) => {
        res.send({ status: 200 })
    })
    async function checkLogin(req, res, next) {
        let token = req.headers['token']
        if (!token) {
            res.send({ status: 401, msg: 'token失效，请重新登录' })
            return false
        }
        let { username, password } = jwt.verify(token, key)
        let table = await getConnect('user')
        let data = await find(table, { username, password })
        if (data.length == 0) {
            res.send({ status: 401, msg: '身份验证失败,请重新登录' })
            return false
        }
        console.log('success')
        next()
    }


    app.post('/register', async (req, res) => {
        let { username, password } = req.body
        let table = await getConnect('user')
        let data = await find(table, { username })
        if (data.length != 0) {
            res.send({ status: 301, msg: "该用户已存在" })
            return
        }
        d = new Date()
        let year = d.getFullYear()
        let month = d.getMonth() + 1
        let day = d.getDate()
        let createTime = year + '-' + month + '-' + day
        await insertOne(table, { realName: '', username: username, password: password, headImg: 'default.jpg', createTime, userBirth: '', signName: '', phone: '', sex: '' })
        res.send({ status: 200, username, msg: "注册成功" })
    })

    app.post('/login', async (req, res) => {
        let { username, password, svgText } = req.body
        if (svgText.toLowerCase() != Buffer.from(app.svgText, 'base64').toString().toLowerCase()) {
            res.send({ status: 401, msg: '验证码错误' })
            return
        }
        let table = await getConnect('user')
        let data = await find(table, { username, password })
        if (data.length == 0) {
            res.send({ status: 401, msg: '用户名或密码错误' })
            return
        }
        let token = jwt.sign({ username, password }, key)
        res.send({ status: 200, msg: '登陆成功', token, user_id: data[0]['_id'], headImg: app.baseUrl + 'image/headImg/' + data[0]['headImg'], username })
    })
    app.svgText = ''
    app.get('/userLogin', (req, res) => {
        const cap = svg.create({
            size: 4,
            fontSize: 32,
            ignoreChars: 'il0o1I',
            noise: 2,
            color: true,
            background: '#cc9966',
            height: 40
        })
        app.svgText = Buffer.from(cap.text).toString('base64')
        res.send(cap.data)
    })


    router.post('/getUserInfo', async (req, res) => {
        let { user_id } = req.body
        let table = await getConnect('user')
        let data = await find(table, { _id: objectId(user_id) })
        data = data[0]
        let { realName, createTime, username, userBirth, signName, phone, sex } = data
        res.send({ status: 200, realName, createTime, username, userBirth, signName, phone, sex })
    })

    let storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, __dirname + '/../image/headImg')
        },
        filename(req, file, cb) {
            cb(null, Date.now() + file.originalname)
        }
    })
    let upload = multer({ storage })


    router.post('/uploadImg', upload.single('file'), async (req, res) => {
        let table = await getConnect('user')
        let _id = objectId(req.body['user_id'])
        table.updateOne({ _id }, { $set: { headImg: req.file.filename } }, (err, data) => {
            if (err) {
                res.send({ status: 401, msg: '上传失败' })
            } else {
                res.send({ status: 200, headImg: app.baseUrl + 'image/headImg/' + req.file.filename })
            }
        })
    })

    router.post('/updateUserInfo', async (req, res) => {
        let table = await getConnect('user')
        let { realName, sex, phone, userBirth, signName, user_id } = req.body
        let _id = objectId(user_id)
        table.updateOne({ _id }, { $set: { realName, sex, phone, userBirth, signName } }, (err, data) => {
            if (err) {
                res.send({ status: 401, msg: '修改失败' })
            } else {
                res.send({ status: 200, msg: '修改成功' })
            }
        })
        console.log(req.body)
    })


    app.get('/getSwipper', async (req, res) => {
        let table = await getConnect('swipper')
        let data = await table.find({}).limit(5).toArray()
        data.forEach(item => {
            item.imgUrl = app.baseUrl + 'image/shouye/swipper/' + item['img_name']
        })
        res.send({ status: 200, data })
    })


    app.get('/getShouyeSort', async (req, res) => {
        let table = await getConnect('swipper')
        let data = await table.find({}).toArray()
        data.splice(0, data.length - 5)
        data.forEach(item => {
            item.imgUrl = app.baseUrl + 'image/shouye/sort/' + item['img_name']
        })
        res.send({ status: 200, data })
    })

    app.get('/getmiddleSwipper', async (req, res) => {
        let table = await getConnect('swipper')
        let data = await table.find({ $or: [{ img_alt: '购书报告' }, { img_alt: '春节放假通知' }, { img_alt: '年度报告' }, { img_alt: '请谨防刷单诈骗' }] }).toArray()
        data.forEach(item => {
            item.imgUrl = app.baseUrl + 'image/shouye/swipper/' + item['img_name']
        })
        res.send({ status: 200, data })
    })

    app.get('/todaySuggestBook', async (req, res) => {
        let table = await getConnect('today_book')
        let data = await table.find({}).limit(6).toArray()
        data.forEach(item => {
            item['big_img_name'] = app.baseUrl + 'image/shouye/detail/' + item['big_img_name']
            item['small_img_name'] = app.baseUrl + 'image/shouye/detail/' + item['small_img_name']
            item['ads_img_url'] = []
            item['ads_img_name_list'].forEach(v => {
                v = app.baseUrl + 'image/shouye/detail/' + v
                item['ads_img_url'].push(v)
            })
        })
        res.send({ status: 200, data })
    })

    app.post('/getShouyeOrder', async (req, res) => {
        let table = await getConnect('popular_book')
        if (req.body.sort == undefined) {
            let data1 = await table.find({ sort: '文学' }).limit(5).toArray()
            let data2 = await table.find({ sort: '社科' }).limit(5).toArray()
            let data3 = await table.find({ sort: '少儿' }).limit(5).toArray()
            let data4 = await table.find({ sort: '艺术' }).limit(5).toArray()
            let arr = [data1, data2, data3, data4]
            for (let i = 1; i <= 4; i++) {
                (arr[i - 1]).forEach(item => {
                    item['big_img_name'] = app.baseUrl + 'image/shouye/wenxue/' + item['big_img_name']
                    item['small_img_name'] = app.baseUrl + 'image/shouye/wenxue/' + item['small_img_name']
                    item['ads_img_url'] = []
                    item['ads_img_name_list'].forEach(v => {
                        v = app.baseUrl + 'image/shouye/wenxue/' + v
                        item['ads_img_url'].push(v)
                    })
                })
            }
            res.send({ status: 200, data: [...data1, ...data2, ...data3, ...data4] })
        } else {
            let data = await table.find({ sort: req.body.sort }).limit(20).toArray()
            data.forEach(item => {
                item['big_img_name'] = app.baseUrl + 'image/shouye/wenxue/' + item['big_img_name']
                item['small_img_name'] = app.baseUrl + 'image/shouye/wenxue/' + item['small_img_name']
                item['ads_img_url'] = []
                item['ads_img_name_list'].forEach(v => {
                    v = app.baseUrl + 'image/shouye/wenxue/' + v
                    item['ads_img_url'].push(v)
                })
            })
            res.send({ status: 200, data })
        }
    })


    app.get('/getAllTodayBook', async (req, res) => {
        let table = await getConnect('today_book')
        let data = await table.find({}).limit(20).toArray()
        data.forEach(item => {
            item['big_img_name'] = app.baseUrl + 'image/shouye/detail/' + item['big_img_name']
            item['small_img_name'] = app.baseUrl + 'image/shouye/detail/' + item['small_img_name']
            item['ads_img_url'] = []
            item['ads_img_name_list'].forEach(v => {
                v = app.baseUrl + 'image/shouye/detail/' + v
                item['ads_img_url'].push(v)
            })
        })
        res.send({ status: 200, data })
    })

    router.post('/bookCollect', async (req, res) => {
        let { isCollection, _id, user_id } = req.body
        let table = await getConnect('bookCollect')
        if (isCollection == undefined) {
            let data = await find(table, { goods_id: objectId(_id), user_id: objectId(user_id) })
            if (data.length > 0) {
                res.send({ status: 200 })
                return false
            } else {
                res.send({ status: 400 })
                return false
            }
        }
        if (isCollection) {
            let data = await insertOne(table, { goods_id: objectId(_id), user_id: objectId(user_id) })
            res.send({ status: 200, data })
        } else {
            let data = await table.remove({ goods_id: objectId(_id) })
            res.send({ status: 200, data })
        }
    })

    router.post('/addCart', async (req, res) => {
        let { _id, user_id, count } = req.body
        let table = await getConnect('cart')
        await insertOne(table, { goods_id: objectId(_id), user_id: objectId(user_id), count, checked: 1 })
        res.send({ status: 200 })
    })
    function getTotalPrice(book_list){
        let totalPrice=0.00;
        book_list.forEach(item =>{
            if(item.cart.checked){
                let price = item.book.price.replace(/¥/,'')
                price = parseFloat(price)
                let count = item.cart.count;
                price = price*count
                totalPrice+=price
            }
        })
        return totalPrice
    }

    router.post('/cart', async (req, res) => {
        let { user_id } = req.body
        let db = await connect()
        let data = await db.collection('cart').find({ user_id: objectId(user_id) }).toArray()
        if (data.length == 0) {
            res.send({ status: 200, cart: 0 })
            return false
        }
        let book_list = []
        let today_book = db.collection('today_book')
        let popular_book = db.collection('popular_book')
        for (let i = 0; i < data.length; i++) {
            let res1 = await today_book.find({ _id: data[i]['goods_id'] }).toArray()
            let res2 = await popular_book.find({ _id: data[i]['goods_id'] }).toArray()
            if (res1.length != 0) {
                res1[0]['big_img_name'] = app.baseUrl + 'image/shouye/detail/' + res1[0]['big_img_name']
                res1[0]['small_img_name'] = app.baseUrl + 'image/shouye/detail/' + res1[0]['small_img_name']
                res1[0]['ads_img_url'] = []
                res1[0]['ads_img_name_list'].forEach(v => {
                    v = app.baseUrl + 'image/shouye/detail/' + v
                    res1[0]['ads_img_url'].push(v)
                })
                book_list.push({ cart: data[i], book: res1[0] })
            }
            if (res2.length != 0) {
                res2[0]['big_img_name'] = app.baseUrl + 'image/shouye/wenxue/' + res2[0]['big_img_name']
                res2[0]['small_img_name'] = app.baseUrl + 'image/shouye/wenxue/' + res2[0]['small_img_name']
                res2[0]['ads_img_url'] = []
                res2[0]['ads_img_name_list'].forEach(v => {
                    v = app.baseUrl + 'image/shouye/wenxue/' + v
                    res2[0]['ads_img_url'].push(v)
                })
                book_list.push({ cart: data[i], book: res2[0] })
            }
        }
        let totalPrice = getTotalPrice(book_list)
        res.send({totalPrice, status: 200, book_list, cart: 1 })
    })

    router.post('/changeCount',async(req, res)=>{
        let {count,cart_id,flag,checked,allChange,user_id} = req.body
        let db = await connect()
        let table = db.collection('cart')
        if(allChange!=undefined){
            table.update({user_id:objectId(user_id)},{$set:{checked}},{multi:true})
            res.send({status: 200})
            return false;
        }
        if(checked!=undefined){
            table.updateOne({ _id:objectId(cart_id) }, { $set: { checked } }, (err, data) => {
                res.send({status:200})
            })
            return false
        }
        if(!flag){
            count--
            table.updateOne({ _id:objectId(cart_id) }, { $set: { count } }, (err, data) => {
                res.send({status:200})
            })
        }else{
            count++
            table.updateOne({ _id:objectId(cart_id) }, { $set: { count } }, (err, data) => {
                res.send({status:200})
            })
        }
    })

    router.post('/removeBook',async(req, res)=>{
        let db = await connect()
        let {id,flag} = req.body
        if(flag){  //删除购物车
            await db.collection('cart').remove({_id:objectId(id)})
            res.send({status:200})
        }else{   //删除收藏
            await db.collection('bookCollect').remove({_id:objectId(id)})
            res.send({status:200})
        }
    })

    router.post('/getCollect',async(req, res)=>{
        let db = await connect()
        let {user_id} = req.body
        let data = await db.collection('bookCollect').find({user_id:objectId(user_id)}).toArray()
        if (data.length == 0) {
            res.send({ status: 200, collection: 0 })
            return false
        }
        let book_list = []
        let today_book = db.collection('today_book')
        let popular_book = db.collection('popular_book')
        for (let i = 0; i < data.length; i++) {
            let res1 = await today_book.find({ _id: data[i]['goods_id'] }).toArray()
            let res2 = await popular_book.find({ _id: data[i]['goods_id'] }).toArray()
            if (res1.length != 0) {
                res1[0]['big_img_name'] = app.baseUrl + 'image/shouye/detail/' + res1[0]['big_img_name']
                res1[0]['small_img_name'] = app.baseUrl + 'image/shouye/detail/' + res1[0]['small_img_name']
                res1[0]['ads_img_url'] = []
                res1[0]['ads_img_name_list'].forEach(v => {
                    v = app.baseUrl + 'image/shouye/detail/' + v
                    res1[0]['ads_img_url'].push(v)
                })
                book_list.push({ collection: data[i], book: res1[0] })
            }
            if (res2.length != 0) {
                res2[0]['big_img_name'] = app.baseUrl + 'image/shouye/wenxue/' + res2[0]['big_img_name']
                res2[0]['small_img_name'] = app.baseUrl + 'image/shouye/wenxue/' + res2[0]['small_img_name']
                res2[0]['ads_img_url'] = []
                res2[0]['ads_img_name_list'].forEach(v => {
                    v = app.baseUrl + 'image/shouye/wenxue/' + v
                    res2[0]['ads_img_url'].push(v)
                })
                book_list.push({ collection: data[i], book: res2[0] })
            }
        }
        res.send({status:200,data:book_list,collection:1})
    })

    app.post('/searchBook',async(req, res)=>{
        let {searchKey} = req.body
        let db = await connect()
        let today_book = db.collection('today_book')
        let popular_book = db.collection('popular_book')
        let res1 = await today_book.find({book_name:{$regex:searchKey}}).toArray()
        let res2 = await popular_book.find({book_name:{$regex:searchKey}}).toArray()
        res1.forEach(item => {
            item['big_img_name'] = app.baseUrl + 'image/shouye/detail/' + item['big_img_name']
            item['small_img_name'] = app.baseUrl + 'image/shouye/detail/' + item['small_img_name']
            item['ads_img_url'] = []
            item['ads_img_name_list'].forEach(v => {
                v = app.baseUrl + 'image/shouye/detail/' + v
                item['ads_img_url'].push(v)
            })
        })
        res2.forEach(item => {
            item['big_img_name'] = app.baseUrl + 'image/shouye/wenxue/' + item['big_img_name']
            item['small_img_name'] = app.baseUrl + 'image/shouye/wenxue/' + item['small_img_name']
            item['ads_img_url'] = []
            item['ads_img_name_list'].forEach(v => {
                v = app.baseUrl + 'image/shouye/wenxue/' + v
                item['ads_img_url'].push(v)
            })
        })
        res.send({status:200,data:[...res1,...res2]})
    })
    app.use('/bookstore', checkLogin, router)
}

module.exports = routes