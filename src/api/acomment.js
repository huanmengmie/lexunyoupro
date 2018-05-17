import request from '@/utils/request'

export function fetchAcomments(data) {
  return request({
    url: '/acomment/fetch',
    type: 'post',
    data
  })
}

export function createAcomment(data) {
  return request({
    url: '/acomment/add',
    method: 'post',
    data
  })
}
  
export function updateAcomment(data) {
  return request({
    url: '/acomment/update',
    method: 'post',
    data
  })
}