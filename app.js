// express
const express = require('express')

const app = express()

// 跨域中间件
const cors = require('cors')
app.use(cors())

// 配置解析表单数据的中间件
app.use(express.urlencoded({ extended: false }))

// 导入并注册用户路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)

app.listen('80', () => {
  console.log('express is running')
})