import request from '@/utils/request'

export function getVipRolelist() {
  return request({
    url: '/system/vipRole/vipRolelist',
    method: 'get'
  })
}
// 设置会员关联 角色的操作
export function vipRefRole(form) {
  return request({
    url: '/system/vipRole/refRole',
    method: 'post',
    data:form,
  })
}
// 查询
export function getVipRole(vipId) {
  return request({
    url: '/system/vipRole/getVipRole',
    method: 'get',
    params: { 'id':vipId },
  })
}

export function getAllVip() {
  return request({
    url: '/system/vip/list',
    method: 'get',
  })
}
