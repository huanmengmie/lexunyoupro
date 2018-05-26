import request from '@/utils/request'

export function fetchRtpList(data) { //  获取角色权限关联信息
  return request({
    url: '/safe/rtp',
    method: 'post',
    data
  })
}

export function fetchUtrList(data) { //  获取用户角色关联信息
  return request({
    url: '/safe/utr',
    method: 'post',
    data
  })
}

export function fetchRoles() { //  获取所有角色信息
  return request({
    url: '/safe/roles',
    method: 'get'
  })
}

export function addRole(data) { //  添加新角色
  return request({
    url: '/safe/role',
    method: 'post',
    data
  })
}

export function updateUtr(data) { //  修改用户角色可用性
  return request({
    url: '/safe/role',
    method: 'put',
    data
  })
}

export function addUtr(data) { //  添加用户角色
  return request({
    url: '/safe/user/role',
    method: 'post',
    data
  })
}

export function fetchPermissions() { //  获取所有权限信息
  return request({
    url: '/safe/permissions',
    method: 'get'
  })
}

export function addPermission(data) { //  添加添加角色权限
  return request({
    url: '/safe/permission',
    method: 'post',
    data
  })
}

export function updateRtp(data) { //  修改角色的某项权限
  return request({
    url: '/safe/permission',
    method: 'put',
    data
  })
}
