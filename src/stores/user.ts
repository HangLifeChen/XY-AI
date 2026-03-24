import { defineStore } from 'pinia'
import type { UserSubscription } from '@/types/user'

export const useUserStore = defineStore('user', {
  state: () => ({
    id: '',
    name: '',
    username: '',
    email: '',
    phone: '',
    bio: '',
    avatar: '',
    isAuthenticated: false,
    token: '',
    role: '',
    refreshToken: '',
    refreshExpire: 0,
    expire: 0, // 添加过期时间字段
    subscription: null as UserSubscription | null,
  }),

  getters: {
    userInfo: (state) => ({
      id: state.id,
      name: state.name,
      username: state.username,
      email: state.email,
      phone: state.phone,
      bio: state.bio,
      avatar: state.avatar,
      role: state.role,
    }),
 
  },

  actions: {
    setUser(userInfo: any) {
      this.id = userInfo.id || ''
      this.name = userInfo.name || ''
      this.username = userInfo.username || ''
      this.email = userInfo.email || ''
      this.phone = userInfo.phone || ''
      this.bio = userInfo.bio || ''
      this.avatar = userInfo.avatar || ''
      this.isAuthenticated = true
      this.role = userInfo.role || ''
    },

    setToken(token: string, expire?: number) {
      this.token = token
      if (expire !== undefined) {
        this.expire = expire
      }
    },

    setAuthData(data: any) {
      // 设置用户信息和令牌
      if (data.userInfo) {
        this.setUser(data.userInfo)
      }

      if (data.token) {
        this.setToken(data.token, data.expire)
      }

      // 处理 refreshToken
      if (data.refreshToken) {
        this.refreshToken = data.refreshToken
      }

      if (data.refreshExpire) {
        // refreshExpire 已经在状态中维护
      }
    },

    clearAuthData() {
      this.id = ''
      this.name = ''
      this.username = ''
      this.email = ''
      this.phone = ''
      this.bio = ''
      this.avatar = ''
      this.isAuthenticated = false
      this.token = ''
      this.role = ''
      this.refreshToken = ''
      this.expire = 0
      this.subscription = null
    },

    logout() {
      this.$reset()
    },

    loadFromStorage() {
      // 由于使用了 Pinia 持久化插件，不再需要手动从 localStorage 加载
      // 状态会在 store 初始化时自动从存储中恢复
    },

    updateProfile(profile: any) {
      this.name = profile.name || this.name
      this.email = profile.email || this.email
      this.phone = profile.phone || this.phone
      this.bio = profile.bio || this.bio
      this.avatar = profile.avatar || this.avatar
    },
  },
  // 持久化存储
  persist: {
    key: 'user-store',
    storage: localStorage,
  },
})
