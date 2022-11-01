import request from '@/utils/request'

// 查询积分申请情况
// 用户申请捐助走人工积分通道
export function applyList(query) {
  return request({
    url: '/content/fund/applyList',
    method: 'get',
    headers: {
      isToken: true
    },
    params:query
  })
}

export function applyPass(id) {
  return request({
    url: '/content/fund/applyPass'+"?id="+id,
    method: 'put',
    headers: {
      isToken: true
    },
  })
}
export function applyReject(id) {
  return request({
    url: '/content/fund/applyReject'+"?id="+id,
    method: 'put',
    headers: {
      isToken: true
    },
  })
}
