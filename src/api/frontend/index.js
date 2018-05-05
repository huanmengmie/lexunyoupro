import request from '@/utils/request'

export function getBanner() {
  return request({
    url: '/index/banner',
    method: 'get'
  })
}
