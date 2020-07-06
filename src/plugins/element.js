import Vue from 'vue'
// 用到的组件需要在这里按需导入并注册
import {
  // 导入login输入框及按钮
  Button,
  Form,
  FormItem,
  Input,
  Message, // 导入弹框提示组件，需要进行全局挂载
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  MessageBox,
  Tag,
  Tree,
  Select,
  Option,
  Cascader,
  Alert,
  Tabs,
  TabPane,
  Steps,
  Step,
  CheckboxGroup,
  Checkbox,
  Upload
} from 'element-ui'

// vue-cli-plugin-element发布时间是2019年1月9日，版本小于2.6.0，比Timeline和TimelineItem早，所以没有这两个组件，下载下来放在了src\plugins\下，跟element.js平级
// 导入两个文件的index.js
import Timeline from './timeline/index.js'
import TimelineItem from './timeline-item/index.js'
// 注册为全局可用的组件
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Steps)
Vue.use(Step)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Upload)
// 注册为全局可用的组件
Vue.use(Timeline)
Vue.use(TimelineItem)

// 全局挂载，前边为自定义名字message
// 将弹框组件挂载在了vue的原型对象上，每个组件可以通过this访问到$message，从而进行弹框提示
Vue.prototype.$message = Message
// 原型挂载的形式挂载了MessageBox的confirm函数挂载到了vue的原型对象上，名字叫做$confirm，在每个组件中都可以通过this.$confirm弹出一个确认消息的提示框
Vue.prototype.$confirm = MessageBox.confirm
