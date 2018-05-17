import request from '@/utils/request'

export function getCitys(parentId, levelType) {
  return request({
    url: '/citys/fetch',
    method: 'get',
    params: { parentId, levelType }
  })
}
