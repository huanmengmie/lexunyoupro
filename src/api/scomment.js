import request from '@/utils/request'

export function fetchScomments(data) {
  return request({
    url: '/scomment/fetch',
    method: 'post',
    data
  })
}

export function fetchScommentsByAid(aid) {
  return request({
    url: '/scomment/fetch/' + aid,
    method: 'get'
  })
}

export function createScomment(data) {
  return request({
    url: '/scomment/add',
    method: 'post',
    data
  })
}

export function updateScomment(data) {
  return request({
    url: '/scomment/update',
    method: 'put',
    data
  })
}
