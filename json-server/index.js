const fs = require('fs')
const path = require('path')
const send = require('koa-send')
const koa = require('koa')
const router = require('koa-router')()

const app = koa()

// x-response-time

app.use(function * (next) {
  const start = new Date
  yield next
  const ms = new Date - start
  this.set('X-Response-Time', ms + 'ms')
})

// logger

app.use(function * (next) {
  const start = new Date
  yield next
  const ms = new Date - start
  console.log('%s %s - %s', this.method, this.url, ms)
})

// file streamer

const routes = require(path.join(__dirname, 'routes'))

function fileStream(fname) {
  return function* (next) {
    yield send(this, fname)
  }
}

function dfs(obj, acc = '') {
  for (let key in obj) {
    if (typeof obj[key] === 'object') dfs(obj[key], acc + key)
    else {
      const method = key
      const fname = `db/${obj[key]}`
      console.log('%s\t%s\t\t\t%s', method, acc, fname)
      router[method](acc, fileStream(fname))
    }
  }
}
dfs(routes)

app.use(router.routes())

app.use(router.allowedMethods())

app.listen(3000)

console.log('\nlistening on port 3000')
