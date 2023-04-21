// express
const express = require('express')

// 导入配置文件
const config = require('./utils/config')

// 解析 token 的中间件
const expressJWT = require('express-jwt')

const app = express()
// 响应数据的中间件
app.use(function (req, res, next) {
  // status = 0 为成功； status = 1 为失败； 默认将 status 的值设置为 1，方便处理失败的情况
  res.cc = function (err, status = 1) {
    res.send({
      // 状态
      status,
      // 状态描述，判断 err 是 错误对象 还是 字符串
      message: err instanceof Error ? err.message : err,
    })
  }
  next()
})

// 跨域中间件
const cors = require('cors')
app.use(cors())



// 配置解析表单数据的中间件
app.use(express.urlencoded({ extended: false }))

// 一定要在配置路由之前配置解析token的文件：使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }))


// 导入并注册用户路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)


const joi = require('joi')

// 错误中间件
app.use(function (err, req, res, next) {
  // 数据验证失败
  if (err instanceof joi.ValidationError) return res.cc(err)
  // 捕获身份认证失败的错误
  if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
  // 未知错误
  res.cc(err)
})


app.listen('80', () => {
  console.log('express is running')
})