import Vue from 'vue'
// 按需引入  按需全局注册
import {
    Button,
    Input,
    Form,
    FormItem,
    Message,
    Link,
    MessageBox,
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
    Tag,
    Loading,
    Tree,
    Select,
    Option
} from 'element-ui';
Vue.use(Select);
Vue.use(Option);
Vue.use(Tree);
Vue.use(Loading);
Vue.use(Tag);
Vue.use(Dialog);
Vue.use(Pagination);
Vue.use(Tooltip);
Vue.use(Switch);
Vue.use(TableColumn);
Vue.use(Table);
Vue.use(Menu);
Vue.use(Col);
Vue.use(Row);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(Button);
Vue.use(Input);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Link);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Card);
Vue.prototype.$loading = Loading;
Vue.prototype.$message = Message;
// MessageBox 有四个 MessageBox, MessageBox.alert, MessageBox.confirm 和 MessageBox.prompt
Vue.prototype.$confirm = MessageBox.confirm;