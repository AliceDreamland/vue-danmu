import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import "./assets/iconfont/iconfont.css";
import {
    Button,
    Affix,
    Avatar,
    Carousel,
    Divider,
    DatePicker,
    Menu,
    Modal,
    Input,
    Icon,
    Pagination,
    Upload,
    Steps,
    Switch,
    FormModel,
    Radio,
    message,
    notification,
    Skeleton,
    Result,
    Table,
    Select,
    Progress,
    Timeline
  } from "ant-design-vue";

Vue.use(Menu);
Vue.prototype.$message = message;
Vue.prototype.$notification = notification;

Vue.component(Button.name, Button);
Vue.component(Affix.name, Affix);
Vue.component(Avatar.name, Avatar);
Vue.component(Carousel.name, Carousel);
Vue.component(Divider.name, Divider);
Vue.component(DatePicker.name, DatePicker);
Vue.component(Modal.name, Modal);
Vue.component(Input.name, Input);
Vue.component(Input.Search.name, Input.Search);
Vue.component(Input.TextArea.name, Input.TextArea);
Vue.component(Icon.name, Icon);
Vue.component(Pagination.name, Pagination);
Vue.component(Upload.name, Upload);
Vue.component(Upload.Dragger.name, Upload.Dragger);
Vue.component(Steps.name, Steps);
Vue.component(Steps.Step.name, Steps.Step);
Vue.component(Switch.name, Switch);
Vue.component(FormModel.name, FormModel);
Vue.component(FormModel.Item.name, FormModel.Item);
Vue.component(Radio.Group.name, Radio.Group);
Vue.component(Radio.Button.name, Radio.Button);
Vue.component(Skeleton.name, Skeleton);
Vue.component(Result.name, Result);
Vue.component(Table.name, Table);
Vue.component(Select.name, Select);
Vue.component(Select.Option.name, Select.Option);
Vue.component(Progress.name, Progress);
Vue.component(Timeline.name, Timeline);
Vue.component(Timeline.Item.name, Timeline.Item);

Vue.config.productionTip = false;

Vue.directive('title', {
    inserted: function (el) {
        document.title = el.dataset.title
    }
})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')