import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'
import FrontLayout from '@/views/frontend/FrontLayout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/errorPage/404'), hidden: true },
  { path: '/401', component: () => import('@/views/errorPage/401'), hidden: true },

  {
    path: '/',
    name: 'Index',
    component: FrontLayout,
    redirect: '/index',
    hidden: true,
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('@/views/frontend/index')
        //  component: resolve => require(['@/view/frontend/index.vue'], resolve)
      }
    ]
  },
  {
    path: '/scenery',
    name: 'Scenery',
    component: FrontLayout,
    redirect: '/scenery/show',
    hidden: true,
    children: [
      {
        path: 'show',
        name: 'sceneryShow',
        component: () => import('@/views/frontend/scenery/index')
      },
      {
        path: 'detail/:id',
        name: 'sceneryDetail',
        component: () => import('@/views/frontend/scenery/detail')
      }
    ]
  },
  {
    path: '/article',
    component: FrontLayout,
    name: 'Article',
    redirect: '/article/show',
    hidden: true,
    children: [
      {
        name: 'articleShow',
        path: 'show',
        component: () => import('@/views/frontend/article/index')
      },
      {
        path: 'detail/:id',
        name: 'articleDetail',
        component: () => import('@/views/frontend/article/detail')
      }
    ]
  },
  {
    path: '/aboutus',
    name: 'Aboutus',
    component: FrontLayout,
    redirect: '/aboutus/show',
    hidden: true,
    children: [
      {
        path: 'show',
        name: 'AboutusShow',
        component: () => import('@/views/frontend/aboutus')
      }
    ]
  },
  {
    path: '/register',
    name: 'Register',
    hidden: true,
    component: FrontLayout,
    redirect: '/register/show',
    children: [
      {
        path: 'show',
        name: 'RegisterShow',
        component: () => import('@/views/frontend/register')
      }
    ]
  }
]

export const asyncRouterMap = [
  {
    path: '/console',
    component: Layout,
    redirect: '/console/dashboard',
    name: 'console',
    meta: { roles: ['user', 'admin'] },
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },
  {
    path: '/myinfo',
    component: Layout,
    redirect: '/myinfo/show',
    name: 'Myinfo',
    meta: { title: '个人信息', icon: 'setup', roles: ['user', 'admin'] },
    children: [
      {
        path: 'show',
        name: 'MyinfoShow',
        component: () => import('@/views/backend/myinfo/index'),
        meta: { title: '概览', icon: 'eye' }
      },
      {
        path: 'update',
        name: 'MyinfoUpdate',
        component: () => import('@/views/backend/myinfo/update'),
        meta: { title: '修改密码', icon: 'configuration' }
      }
    ]
  },
  {
    path: '/mcustomer',
    component: Layout,
    redirect: '/mcustomer/show',
    name: 'Mcustomer',
    meta: { title: '用户管理', icon: 'setup', roles: ['admin'] },
    children: [
      {
        path: 'show',
        name: 'McustomerShow',
        component: () => import('@/views/backend/mcustomer/index'),
        meta: { title: '所有用户', icon: 'user' }
      }
    ]
  },
  {
    path: '/marticle',
    component: Layout,
    redirect: '/marticle/show',
    name: 'Marticle',
    meta: { title: '文章管理', icon: 'setup', roles: ['admin', 'user'] },
    children: [
      {
        path: 'show',
        name: 'MarticleShow',
        component: () => import('@/views/backend/marticle/index.vue'),
        meta: { title: '我的随笔', icon: 'setup' }
      },
      {
        path: 'all',
        name: 'MarticleAll',
        component: () => import('@/views/backend/marticle/all.vue'),
        meta: { title: '所有文章', icon: 'setup', roles: ['admin'] }
      },
      {
        path: 'add',
        name: 'MyArticleAdd',
        component: () => import('@/views/backend/marticle/add.vue'),
        meta: { title: '发布文章', icon: 'configuration' }
      },
      {
        path: 'edit/:id',
        hidden: true,
        name: 'MarticleEdit',
        component: () => import('@/views/backend/marticle/edit.vue'),
        meta: { title: '修改文章' }
      }
    ]
  },
  {
    path: '/mscenery',
    component: Layout,
    redirect: '/mscenery/show',
    name: 'Mscenery',
    meta: { title: '景点管理', icon: 'setup', roles: ['admin'] },
    children: [
      {
        path: 'show',
        name: 'MsceneryShow',
        component: () => import('@/views/backend/mscenery/index.vue'),
        meta: { title: '景点概览', icon: 'eye' }
      },
      {
        path: 'add',
        name: 'MsceneryAdd',
        component: () => import('@/views/backend/mscenery/add.vue'),
        meta: { title: '发布新景点', icon: 'configuration' }
      },
      {
        path: 'edit/:id',
        hidden: true,
        name: 'MsceneryEdit',
        component: () => import('@/views/backend/mscenery/edit.vue'),
        meta: { title: '修改景点' }
      }
    ]
  },
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/show',
    name: 'Permission',
    meta: { title: '权限控制', icon: 'setup', roles: ['admin'] },
    children: [
      {
        path: 'show',
        name: 'PermissionShow',
        component: () => import('@/views/backend/permission/index.vue'),
        meta: { title: '概览', icon: 'eye' }
      },
      {
        path: 'setup',
        name: 'PermissionSetup',
        component: () => import('@/views/backend/permission/setup'),
        meta: { title: '配置', icon: 'configuration' }
      }
    ]
  },
  {
    path: '/manage',
    component: Layout,
    redirect: '/manamge/banner',
    name: 'Manage',
    meta: { title: '其他', icon: 'recommend', roles: ['admin'] },
    children: [
      {
        path: 'banner',
        name: 'ManageBanner',
        component: () => import('@/views/backend/manage/index.vue'),
        meta: { title: '轮播图片', icon: 'picture' }
      },
      {
        path: 'scenery',
        name: 'ManageScenery',
        component: () => import('@/views/backend/manage/tags.vue'),
        meta: { title: '标签管理', icon: 'picture' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

