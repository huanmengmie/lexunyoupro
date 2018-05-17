import request from '@/utils/request'

export function getBanner(data) {
  return request({
    url: '/index/banner',
    method: 'post',
    data
  })
}
