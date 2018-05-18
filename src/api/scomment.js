import request from '@/utils/request'

export function fetchScomments(data) {
  return request({
    url: '/scomment/fetch',
    type: 'post',
    data
  })
}

export function fetchScommentsByAid(aid) {
  return request({
    url: '/scomment/fetch/' + aid,
    type: 'get'
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
    method: 'post',
    data
  })
}
