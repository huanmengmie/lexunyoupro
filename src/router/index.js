import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

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
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    name: 'Index',
    component: () => import('@/views/frontend/index')
  //  component: resolve => require(['@/view/frontend/index.vue'], resolve)
  },
  {
    path: '/scenery',
    name: 'Scenery',
    component: () => import('@/views/frontend/scenery')
  },
  {
    path: '/article',
    name: 'Article',
    component: () => import('@/views/frontend/article')
  },
  {
    path: '/aboutus',
    name: 'Aboutus',
    component: () => import('@/views/frontend/aboutus')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/frontend/register')
  },
  {
    path: '/console',
    component: Layout,
    redirect: '/console/dashboard',
    name: 'Dashboard',
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
    meta: { title: '个人信息', icon: 'setup' },
    children: [
      {
        path: 'show',
        name: 'MyinfoShow',
        component: () => import('@/views/backend/manage/index.vue'),
        meta: { title: '概览', icon: 'eye' }
      },
      {
        path: 'update',
        name: 'MyinfoUpdate',
        component: () => import('@/views/backend/manage/index.vue'),
        meta: { title: '修改信息', icon: 'configuration' }
      }
    ]
  },
  {
    path: '/marticle',
    component: Layout,
    redirect: '/marticle/show',
    name: 'Marticle',
    meta: { title: '我的文章', icon: 'setup' },
    children: [
      {
        path: 'show',
        name: 'MarticleShow',
        component: () => import('@/views/backend/marticle/index.vue'),
        meta: { title: '已发布', icon: 'eye' }
      },
      {
        path: 'add',
        name: 'MarticleAdd',
        component: () => import('@/views/backend/marticle/add.vue'),
        meta: { title: '发布文章', icon: 'configuration' }
      }
    ]
  },
  {
    path: '/mscenery',
    component: Layout,
    redirect: '/mscenery/show',
    name: 'Mscenery',
    meta: { title: '景点管理', icon: 'setup' },
    children: [
      {
        path: 'show',
        name: 'MsceneryShow',
        component: () => import('@/views/backend/manage/tags.vue'),
        meta: { title: '已发布', icon: 'eye' }
      },
      {
        path: 'add',
        name: 'MsceneryAdd',
        component: () => import('@/views/backend/manage/index.vue'),
        meta: { title: '发布新景点', icon: 'configuration' }
      }
    ]
  },
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/show',
    name: 'Permission',
    meta: { title: '权限控制', icon: 'setup' },
    children: [
      {
        path: 'show',
        name: 'PermissionShow',
        component: () => import('@/views/backend/manage/index.vue'),
        meta: { title: '概览', icon: 'eye' }
      },
      {
        path: 'setup',
        name: 'PermissionSetup',
        component: () => import('@/views/backend/manage/index.vue'),
        meta: { title: '配置', icon: 'configuration' }
      }
    ]
  },
  {
    path: '/manage',
    component: Layout,
    redirect: '/manamge/banner',
    name: 'Manage',
    meta: { title: '其他', icon: 'recommend' },
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
      },
      {
        path: 'article',
        name: 'ManageArticle',
        component: () => import('@/views/backend/manage/article.vue'),
        meta: { title: '文章筛选', icon: 'article' }
      }
    ]
  },
  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/table',
  //   name: 'Example',
  //   meta: { title: 'Example', icon: 'example' },
  //   children: [
  //     {
  //       path: 'table',
  //       name: 'Table',
  //       component: () => import('@/views/table/index'),
  //       meta: { title: 'Table', icon: 'table' }
  //     },
  //     {
  //       path: 'tree',
  //       name: 'Tree',
  //       component: () => import('@/views/tree/index'),
  //       meta: { title: 'Tree', icon: 'tree' }
  //     }
  //   ]
  // },

  // {
  //   path: '/form',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Form',
  //       component: () => import('@/views/form/index'),
  //       meta: { title: 'Form', icon: 'form' }
  //     }
  //   ]
  // },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

