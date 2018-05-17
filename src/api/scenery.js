import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/sceneryInfo/fetch',
    method: 'post',
    data
  })
}

export function fetchScenery(id) {
  return request({
    url: '/sceneryInfo/detail',
    method: 'get',
    params: { id }
  })
}

export function createScenery(data) {
  return request({
    url: '/sceneryInfo/add',
    method: 'post',
    data
  })
}

export function updateScenery(data) {
  return request({
    url: '/sceneryInfo/update',
    method: 'put',
    data
  })
}
