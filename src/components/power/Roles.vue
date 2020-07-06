<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 按钮放在一行里面-->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表区域 :data绑定数据-->
      <el-table :data="rolelist" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <!-- 作用域插槽拿到对应的角色信息，通过三层for循环，渲染出三层权限 -->
          <template slot-scope="scope">
            <!-- 栅格系统 总共24列 :class动态绑定，所有的都有底边框，是否有上边框应该判断是不是第一个，使用三元表达式来判断-->
            <el-row :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
              <!-- 渲染一级权限 5列 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">{{item1.authName}}</el-tag>
                <!-- 一级权限后的小图标 -->
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 共计19列 -->
              <el-col :span="19">
                <!-- 通过 for 循环 嵌套渲染二级权限 判断是否为第一个也就是i2 === 0，如果不等于0则添加-->
                <el-row :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <!-- type="success"绿色 closable添加删除小图标，为tab标签添加响应时间close-->
                    <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 type="warning"黄色-->
                  <el-col :span="18">
                    <el-tag type="warning" v-for="(item3) in item2.children" :key="item3.id" closable @close="removeRightById(scope.row, item3.id)">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>

            <!-- <pre>
              {{scope.row}}
            </pre> -->
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <!-- 设置宽度width保证一行显示 -->
        <el-table-column label="操作" width="300px">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限的对话框 close关闭对话框时应该清空保存权限ID的数组，避免累加越来越多-->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClosed">
      <!-- 树形控件 show-checkbox添加复选框 全选和半选 node-key表示选中的为id值 default-expand-all默认展开所有节点 :default-checked-keys默认勾选的节点 ref加一个引用-->
      <el-tree :data="rightslist" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有角色列表数据
      rolelist: [],
      // 控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      // 所有权限的数据
      rightslist: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的节点Id值数组
      defKeys: [],
      // 当前即将分配权限的角色id
      roleId: ''
    }
  },
  // 生命周期函数
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取所有角色的列表 使用async、await简化异步的网络请求，结构赋值出data属性，并且用冒号重命名为res
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')

      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！')
      }
      // 成功
      this.rolelist = res.data

      console.log(this.rolelist)
    },
    // 根据Id删除对应的权限
    async removeRightById(role, rightId) {
      // 弹框提示用户是否要删除，$confirm返回值为Promise
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      // 通过catch捕获取消的行为，也return出去
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除！')
      }
      // 反引号表示字符串 角色id和权限id 用$拼接
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )

      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败！')
      }

      // this.getRolesList() 刷新数据列表 每次点击之后下拉菜单自动合上了，因为这句话会重新获取数据列表，重新渲染
      // 重新赋值
      role.children = res.data
    },
    // 展示分配权限的对话框
    async showSetRightDialog(role) {
      // 保存id方便角色分配权限使用
      this.roleId = role.id
      // 获取所有权限的数据，树形结构
      const { data: res } = await this.$http.get('rights/tree')

      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败！')
      }

      // 把获取到的权限数据保存到 data 中
      this.rightslist = res.data
      console.log(this.rightslist)

      // 递归获取三级节点的Id，node节点为当前角色，当前角色为最父级的节点，包含children属性，通过递归的形式找到三级节点的id
      this.getLeafKeys(role, this.defKeys)
      // 展示
      this.setRightDialogVisible = true
    },
    // 通过递归的形式，获取角色下所有三级权限的id，并保存到 defKeys 数组中
    // 判断一个节点node，结果保存在arr中，应该在弹出对话框的时候就调用
    getLeafKeys(node, arr) {
      // 如果当前 node 节点不包含 children 属性，则是三级节点
      if (!node.children) {
        // 直接将节点的id值保存在arr
        return arr.push(node.id)
      }
      // 递归forEach,每循环一项拿到子节点item，item再次调用递归函数，通过递归将所有三级节点的id保存
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed() {
      this.defKeys = []
    },
    // 点击为角色分配权限
    async allotRights() {
      // 在数组中拿到所有半选和全选状态下的id，通过展开运算符将两个数组合并为一个新数组
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // id数组变成以逗号拼接的字符串
      const idStr = keys.join(',')
      // 角色id在弹出分配权限对话框的时候保存
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        // 请求体
        { rids: idStr }
      )

      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败！')
      }

      this.$message.success('分配权限成功！')
      // 成功后刷新列表
      this.getRolesList()
      // 关闭对话框
      this.setRightDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>

// 一级权限标签之间的距离
.el-tag {
  margin: 7px;
}
// 设置边框线1 第一个有上边框，所有的都有下边框
.bdtop {
  border-top: 1px solid #eee;
}
// 设置边框线2
.bdbottom {
  border-bottom: 1px solid #eee;
}
// 纵向上居中对齐
.vcenter {
  display: flex;
  align-items: center;
}
</style>
