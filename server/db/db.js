const sha1 = require('sha1')
const axios = require('axios')

// 线上数据库命名空间
const className = 'todo'

// 创建一个 axios 实例
const request = axios.create({
  baseURL: 'http://d.apicloud.com/mcm/api'
})

const createError = (code, resp) => {
  const err = new Error(resp.message)
  err.code = code
  return err
}

// 用于处理 request 的公用方法
const handleRequest = ({
  status,
  data,
  ...rest
}) => {
  if (status === 200) {
    return data
  } else {
    throw createError(status, rest)
  }
}

module.exports = (appId, appKey) => {
  const getHeaders = () => {
    const now = Date.now()
    return {
      'X-APICloud-AppId': appId,
      'X-APICloud-AppKey': `${sha1(`${appId}UZ${appKey}UZ${now}`)}.${now}`
    }
  }
  // 获取 header 签名需要的时间 now 还过期，所以每次操作都为了保险加上 getHeaders()
  return {
    async getAllTodos() {
      return handleRequest(await request.get(`/${className}`, {
        headers: getHeaders()
      }))
    },
    async addTodo(todo) {
      return handleRequest(await request.post(
        `/${className}`,
        todo, {
          headers: getHeaders()
        }
      ))
    },
    async updateTodo(id, todo) {
      return handleRequest(await request.put(
        `/${className}/${id}`,
        todo, {
          headers: getHeaders()
        }
      ))
    },
    async deleteTodo(id) {
      return handleRequest(await request.delete(
        `/${className}/${id}`, {
          headers: getHeaders()
        }
      ))
    },
    // 批处理请求
    async deleteCompleted(ids) {
      // requests 作为 config 配置传入 axios.post
      const requests = ids.map(id => {
        return {
          method: 'DELETE',
          path: `/mcm/api/${className}/${id}`
        }
      })
      return handleRequest(await request.post(
        '/batch', {
          requests
        }, {
          headers: getHeaders()
        }
      ))
    }
  }
}
