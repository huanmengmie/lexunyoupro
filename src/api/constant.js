import request from '@/utils/request'

export function fetchConstant(data) {
  return request({
    url: '/constant/fetch',
    method: 'post',
    data
  })
}

export function addConstant(data) {
  return request({
    url: '/constant/add',
    method: 'post',
    data
  })
}

export function updateConstant(data) {
  return request({
    url: '/constant/update',
    method: 'post',
    data
  })
}

