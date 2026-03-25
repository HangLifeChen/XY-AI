<template>
  <div class="main-layout">
    <el-container>
      <header v-if="!isAgentExecutePage" class="navbar">
      <div class="container">
        <router-link to="/" class="logo">
          <span class="logo-icon">
            <el-icon size="35"><Connection /></el-icon>
          </span>
          <span class="logo-text">小易<span class="logo-highlight">AI</span><span class="logo-text">后台管理</span></span>
        </router-link>
        <div v-if="isAuthenticated" class="user-actions">
          <el-dropdown @command="handleUserCommand">
            <div class="user-profile">
              <el-avatar v-if="userStore.userInfo.avatar" :size="32" :src="userStore.userInfo.avatar" />
              <el-avatar v-else :size="32" :icon="UserFilled" />
              <span class="username">{{ userStore.userInfo.username }}</span>
              <el-icon><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon><User /></el-icon>
                  个人资料
                </el-dropdown-item>
                <el-dropdown-item command="settings">
                  <el-icon><Setting /></el-icon>
                  系统设置
                </el-dropdown-item>            
                <el-dropdown-item divided command="logout">
                  <el-icon><SwitchButton /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </header>


      <el-container>
        <el-aside width="200px">
          <el-scrollbar>
        <el-menu :default-openeds="['1', '3']">
          <el-sub-menu index="1">
            <template #title>
              <el-icon><message /></el-icon>Navigator One
            </template>
            <el-menu-item-group>
              <template #title>Group 1</template>
              <el-menu-item index="1-1">Option 1</el-menu-item>
              <el-menu-item index="1-2">Option 2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="Group 2">
              <el-menu-item index="1-3">Option 3</el-menu-item>
            </el-menu-item-group>
            <el-sub-menu index="1-4">
              <template #title>Option4</template>
              <el-menu-item index="1-4-1">Option 4-1</el-menu-item>
            </el-sub-menu>
          </el-sub-menu>
          <el-sub-menu index="2">
            <template #title>
              <el-icon><icon-menu /></el-icon>Navigator Two
            </template>
            <el-menu-item-group>
              <template #title>Group 1</template>
              <el-menu-item index="2-1">Option 1</el-menu-item>
              <el-menu-item index="2-2">Option 2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="Group 2">
              <el-menu-item index="2-3">Option 3</el-menu-item>
            </el-menu-item-group>
            <el-sub-menu index="2-4">
              <template #title>Option 4</template>
              <el-menu-item index="2-4-1">Option 4-1</el-menu-item>
            </el-sub-menu>
          </el-sub-menu>
          <el-sub-menu index="3">
            <template #title>
              <el-icon><setting /></el-icon>Navigator Three
            </template>
            <el-menu-item-group>
              <template #title>Group 1</template>
              <el-menu-item index="3-1">Option 1</el-menu-item>
              <el-menu-item index="3-2">Option 2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="Group 2">
              <el-menu-item index="3-3">Option 3</el-menu-item>
            </el-menu-item-group>
            <el-sub-menu index="3-4">
              <template #title>Option 4</template>
              <el-menu-item index="3-4-1">Option 4-1</el-menu-item>
            </el-sub-menu>
          </el-sub-menu>
        </el-menu>
      </el-scrollbar>
        </el-aside>
        <el-container>

          
          <el-main><slot></slot></el-main>
           <footer v-if="!isAgentExecutePage" class="footer">
            <div class="container">
              <div class="footer-content">
                <p class="copyright">© 2025 小易AI. All rights reserved.</p>
                <div class="footer-links">
                  <a href="#">帮助文档</a>
                  <a href="#">用户协议</a>
                  <a href="#">隐私政策</a>
                </div>
              </div>
            </div>
          </footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>


<script setup>
import { computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import {
  User,
  UserFilled,
  ArrowDown,
  Setting,
  SwitchButton,
  Connection,
  CreditCard,
  Message,
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

defineProps({
  centerContent: {
    type: Boolean,
    default: false,
  },
})

const isAuthenticated = computed(() => userStore.isAuthenticated)

// 判断当前是否为Agent执行页面
const isAgentExecutePage = computed(() => {
  console.log('isAgentExecutePage:', route.name)
  return route.name === 'agent-execute'
})

// 控制侧边栏显示
const showSidebar = computed(() => route.meta.showSidebar !== false)

// 用户下拉菜单命令处理
const handleUserCommand = (command) => {
  switch (command) {
    case 'profile':
      // 跳转到个人资料页面
      router.push('/profile')
      break
    case 'settings':
      // 跳转到系统设置页面
      router.push('/settings')
      break
    case 'models':
      // 跳转到模型管理页面
      router.push('/models')
      break
    case 'mcp-services':
      router.push('/mcp-services')
      break
    case 'subscription':
      router.push('/subscription')
      break
    case 'logout':
      logout()
      break
  }
}

// 退出登录
const logout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.main-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
}

.el-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.el-header {
  padding: 0;
  background-color: var(--background-color-white);
  box-shadow: var(--box-shadow-base);
  border-bottom: 1px solid var(--border-color-light);
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: var(--header-height);
  padding: 0 1.5rem;
}

.collapse-icon {
  font-size: 20px;
  cursor: pointer;
  color: var(--text-primary);
  transition: var(--transition-all);
}

.collapse-icon:hover {
  transform: rotate(90deg);
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-left: 1rem;
}

.username {
  margin-left: 0.5rem;
  font-size: 14px;
  color: var(--text-primary);
}

.container {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
}

.navbar {
  height: var(--header-height);
  background-color: var(--background-color-white);
  box-shadow: var(--box-shadow-base);
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid var(--border-color-light);
  width: 100%;
}


.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.4rem;
  color: var(--text-primary);
  transition: var(--transition-all);
  gap: 0.5rem;
}

.logo:hover {
  transform: translateY(-1px);
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #cc1616 0%, #e53939 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 20px 40px rgba(204, 22, 22, 0.2);
}

.logo-text {
  display: flex;
  align-items: baseline;
}

.logo-highlight {
  font-size: 1.8rem;
  color: var(--primary-color);
}

.nav-links {
  display: flex;
  gap: 0.25rem;
  margin-left: 2rem;
  height: 100%;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 1rem;
  height: 100%;
  color: var(--text-regular);
  text-decoration: none;
  font-weight: 500;
  transition: var(--transition-all);
  border-bottom: 2px solid transparent;
  border-radius: var(--border-radius-base);
  margin: 0 0.125rem;
}

.nav-link:hover,
.nav-link.router-link-exact-active {
  color: var(--primary-color);
  background-color: var(--background-color);
}

.nav-link.router-link-exact-active {
  border-bottom-color: var(--primary-color);
}

.user-actions {
  margin-left: auto;
  display: flex;
  align-items: center;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: var(--border-radius-base);
  cursor: pointer;
  transition: var(--transition-all);
}

.user-profile:hover {
  background-color: var(--background-color);
}

.username {
  font-weight: 500;
  color: var(--text-primary);
}

.content-wrapper {
  display: flex;
  flex: 1;
  width: 100%;
  background-color: var(--background-color);
}

.main-content {
  flex: 1;
  width: 100%;
}
.main-content.is-centered {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 10vh;
}

.footer {
  background: var(--background-color-white);
  color: var(--text-secondary);
  padding: 1.5rem 0;
  border-top: 1px solid var(--border-color-light);
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.copyright {
  margin: 0;
  font-size: var(--font-size-small);
}

.footer-links {
  display: flex;
  gap: 1.5rem;
}

.footer-links a {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: var(--font-size-small);
  transition: var(--transition-all);
}

.footer-links a:hover {
  color: var(--primary-color);
}

/* 响应式设计 */
@media (max-width: 992px) {
  .nav-links {
    gap: 0.25rem;
    margin-left: 1rem;
  }

  .nav-link span {
    display: none;
  }

  .nav-link {
    padding: 0 0.75rem;
  }

  .logo-text span:not(.logo-highlight) {
    display: none;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }

  .nav-links {
    margin-left: 0.5rem;
  }

  .user-actions .username {
    display: none;
  }

  .footer-content {
    flex-direction: column;
    text-align: center;
  }

  .footer-links {
    gap: 1rem;
  }
}
</style>
