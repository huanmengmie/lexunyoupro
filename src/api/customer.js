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

export function updateCustomer(data) {
  return request({
    url: '/customer/update',
    method: 'put',
    data
  })
}
