import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/customer/fetch',
    method: 'post',
    data
  })
}

export function fetchCustomer(id) {
  return request({
    url: '/customer/detail/' + id,
    method: 'get'
  })
}

export function addCustomer(data) {
  return request({
    url: '/customer/add',
    method: 'post',
    data
  })
}

export function getInfo(phone) { // 获取用户信息
  return request({
    url: '/customer/info',
    method: 'get',
    params: { phone }
  })
}

export function ifExist(phone) { // 判断账号是否存在
  return request({
    url: '/customer/exist',
    method: 'get',
    params: { phone }
  })
}

export function updateCustomer(data) {
  return request({
    url: '/customer/update',
    method: 'put',
    data
  })
}

export function registerCode(phone) {
  return request({
    url: '/register/' + phone,
    method: 'get'
  })
}

export function register(data) {
  return request({
    url: '/register',
    method: 'post',
    data
  })
}

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}
