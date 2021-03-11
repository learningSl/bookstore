const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
app.baseUrl = 'http://192.168.43.251:3000/'
app.use(cors())
// app.use(require('cookie-parser')())
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

app.use('/image',express.static(__dirname + '/image'))
require('./routes/index.js')(app)

app.listen(3000,'192.168.43.251',()=>{
    console.log("服务器启动成功")
})