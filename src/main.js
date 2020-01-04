import Vue from 'vue'
import 'lib-flexible/flexible.js'
import './css/normal.css'
import App from './App.vue'
import { Field,Picker,Switch,ActionSheet,Button,Cell, CellGroup,Icon,Toast } from 'vant';
Vue.use(Field);
Vue.use(Picker);
Vue.use(Switch);
Vue.use(ActionSheet);
Vue.use(Button);
Vue.use(Cell);
Vue.use(CellGroup);
Vue.use(Icon);
Vue.use(Toast);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
