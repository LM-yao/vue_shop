<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <!-- type="info"会渲染出灰色按钮 -->
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <!-- 折叠时64px,不折叠200px -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 侧边栏展开按钮 -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 active-text-color激活颜色 unique-opened设置为true，保证每次只有一个菜单项 collapse-transition关闭折叠动画（均为布尔值，所以需要加冒号，动态数据绑定）开启router模式，会跳转到id值 -->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF" unique-opened :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath">
          <!-- 一级菜单 -->
          <!-- 循环渲染一级菜单 v-for 每个v-for提供一个key属性 一般key的值为id 每个index设置为item.id,需要为字符串，从而可以只展开一个一级菜单-->
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标动态绑定 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 authName-->
              <span>{{item.authName}}</span>
            </template>

            <!-- 二级菜单 -->
            <!-- 循环创建二级菜单 -->
            <!-- 路由跳转需要用到index，一般选用路径path，但是path不以/开头，所以先加入一个/  -->
            <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/' + subItem.path)">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 路由占位符 home会重定向到welcome-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 左侧菜单数据
      menulist: [],
      // id作为key，图标作为值
      iconsObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      // 是否折叠，默认为不折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: ''
    }
  },
  created() {
    // 调用getMenuList获取所有的左侧菜单
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      // 清空token
      window.sessionStorage.clear()
      // 跳转到登陆页，重定向
      this.$router.push('/login')
    },
    // 获取所有的菜单
    // async 和 await简化操作
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      // 判断是否获取到数据
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
      console.log(res)
    },
    // 点击按钮，切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      // 重新赋值，实现动态切换
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
// 全屏
.home-container {
  height: 100%;
}
// el-header相当于类名
.el-header {
  // 背景颜色
  background-color: #373d41;
  // 使用flex布局 左右贴边对齐
  display: flex;
  justify-content: space-between;
  // 去除图片左边空白
  padding-left: 0;
  // 按钮居中
  align-items: center;
  // 白色文本
  color: #fff;
  font-size: 20px;
  // 给左侧div再加一个flex布局，使其居中
  > div {
    // 嵌套flex布局
    display: flex;
    // 居中
    align-items: center;
    // 文本和图片之间加间距
    span {
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: #333744;
  // 去除边框线从而展开后右侧边框线也可以对齐
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}
// 图标和文本之间的间距
.iconfont {
  margin-right: 10px;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  // 三个竖线之间的距离
  letter-spacing: 0.2em;
  // 鼠标放上去变成小手
  cursor: pointer;
}
</style>
