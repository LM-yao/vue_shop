<!-- 登陆组件，由三部分组成，结构、样式、行为 -->
<!-- element UI网站表单和验证,焦点-->
<!-- 模板区域开始 -->
<template>
<!-- 登陆组件 -->
  <div class="login_container">
    <!-- 登陆盒子 -->
    <div class="login_box">
      <!-- 头像区域-->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <!-- 登录表单区域 -->
      <!--label-width占位， :model数据绑定-->
      <!-- 表单验证：①属性绑定rules校验对象②data()中定义校验对象，每个属性都是一个校验规则 ③为不同的表单item项通过prop指定验证规则-->
      <!-- 取消验证规则，ref获取表单的实例对象loginFormRef，为了重置 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
        <!-- 用户名 -->
        <!-- 添加图标 prefix-icon 采用阿里图标库 iconfont，v-model数据双向绑定-->
        <!-- prop加给item -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <!-- 登陆的预验证 -->
          <el-button type="primary" @click="login">登录</el-button>
          <!-- 为重置绑定单击事件 -->
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<!--行为-->
<script>
export default {
  data() {
    return {
      // 这是登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 这是表单的验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          // blur文本框失去焦点时触发
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 点击重置按钮，重置登录表单
    resetLoginForm() {
      // console.log(this);
      // 打印this，$refs是一个数据对象，$refs有属性loginFormRef（表单的引用对象），数据会变成双向绑定的那个数据
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      // 表单的引用对象调用validate函数，validate接收一个回调函数（匿名的箭头函数），第一个形参为验证结果布尔值valid，表明表单是否验证通过
      this.$refs.loginFormRef.validate(async valid => {
        // 判断是否通过，发起请求
        if (!valid) return // 不发起请求
        // 发起post请求，请求地址login，请求对象为登录表单的数据绑定对象
        // 返回Promise，await简化Promise操作，await只能用在async异步，之后变为具体响应对象（axios封装好的，只需要其中的data）
        // const { data: res } 解构出data,并重命名为res
        // element ui 的message消息提示
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('登录失败！')
        // 访问$message
        this.$message.success('登录成功')
        // 登陆身份认证信息token,localStorage是持久化的存储机制，sessionStorage会话期间存储机制
        // 1. 将登录成功之后的 token，保存到客户端的 sessionStorage 中
        //   1.1 项目中出了登录之外的其他API接口，必须在登录之后才能访问
        //   1.2 token 只应在当前网站打开期间生效，所以将 token 保存在 sessionStorage 中
        // 调用属于window的API的session，键为token，值为res.data.token
        // 向sessionStorage保存token
        window.sessionStorage.setItem('token', res.data.token)
        // 2. 通过编程式导航跳转到后台主页，$router对象调用push方法，路由地址是 /home
        this.$router.push('/home')
      })
    }
  }
}
</script>
<!--支持less语法格式，scope表示样式只在此页面生效，去掉则全局生效，单文件组件需要加入scope指令，防止组件之间的样式冲突-->
<!--安装开发依赖 less-loader 和 less两个依赖-->
<style lang="less" scoped>
// 类选择器
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  // 圆角边框
  border-radius: 3px;
  //绝对定位
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);//移动自己的50%
  //头像，less的语法嵌套
  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    //加入角度，圆角边框，边框会比图片小，所以给图片也要加
    border-radius: 50%;
    // 图片和边框直接的间距
    padding: 10px;
    //边框加阴影
    box-shadow: 0 0 10px #ddd;
    //设置位置
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);//再向左和上分别移动自己的百分之五十，65px
    //填补空白背景
    background-color: #fff;
    // 宽高为父盒子的100%
    img {
      width: 100%;
      height: 100%;
      //加入角度，圆角图片
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.login_form {
  position: absolute;
  // 距离底部对齐
  bottom: 0;
  width: 100%;
  // 上下、左右
  padding: 0 20px;
  //避免超出范围
  box-sizing: border-box;
}
//居右对其
.btns {
  // 变成弹性盒模型
  display: flex;
  //横轴上尾部对齐
  justify-content: flex-end;
}
</style>
