import request from '@/utils/request'

// 查询积分申请情况
// 用户申请捐助走人工积分通道
export function getNavList() {
  return request({
    url: '/content/guide/nav/list',
    method: 'get',
    headers: {
      isToken: true
    },
  })
}

export function getTreeselectNav() {
  return request({
    url: '/content/guide/nav/treeselectNav',
    method: 'get',
    headers: {
      isToken: true
    },
  })
}

export function editNav(form) {
  return request({
    url: '/content/guide/nav/edit',
    method: 'put',
    headers: {
      isToken: true
    },
    data:form,
  })
}
export function deleteNav(id) {
  return request({
    url: '/content/guide/nav/'+id,
    method: 'delete',
    headers: {
      isToken: true
    },
  })
}

export function listGuideArticle(params) {
  return request({
    url: '/content/guide/list',
    method: 'get',
    headers: {
      isToken: true
    },
    params:params
  })
}
