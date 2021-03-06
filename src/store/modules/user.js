import { login, logout, getInfo } from '@/api/customer'
import { Message } from 'element-ui'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    id: '',
    token: getToken(),
    name: '',
    phone: '',
    avatar: '',
    roles: []
  },

  mutations: {
    SET_ID: (state, id) => {
      state.id = id
    },
    SET_TOKEN: (state, token) => {
      if (token !== undefined) {
        state.token = token
      }
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PHONE: (state, phone) => {
      state.phone = phone
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          setToken(response.data)
          commit('SET_TOKEN', response.data)
          Message({
            type: 'success',
            message: response.message
          })
          localStorage.setItem('userPhone', userInfo.phone)
          resolve()
        }).catch(error => {
          Message({
            type: 'error',
            message: '用户名或密码错误'
          })
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(localStorage.getItem('userPhone')).then(response => {
          const data = response.data
          if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            const roles = []
            data.roles.forEach(element => {
              roles.push(element.roleName)
            })
            commit('SET_ROLES', roles)
          } else {
            reject('getInfo: roles must be a non-null array !')
          }
          commit('SET_ID', data.id)
          commit('SET_NAME', data.userName)
          commit('SET_AVATAR', data.avatar)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_AVATAR', '')
          localStorage.removeItem('userPhone')
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
