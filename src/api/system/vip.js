import request from '@/utils/request'

export function getVipRolelist() {
  return request({
    url: '/system/vip/vipRolelist',
    method: 'get'
  })
}
// 设置会员关联 角色的操作

export function vipRefRole(form) {
  return request({
    url: '/system/vip/refRole',
    method: 'post',
    data:form,
  })
}

export function getVipRole(vipId) {
  return request({
    url: '/system/vip/getVipRole',
    method: 'get',
    params: { 'id':vipId },
  })
}
