import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'vant/lib/index.css';
import { Icon, SubmitBar, Stepper, Checkbox, CheckboxGroup, SwipeCell, Field, Form, Tag, Button, Card, Tab, Tabs, Swipe, SwipeItem, Lazyload, Badge, Sidebar, SidebarItem, Collapse, CollapseItem, Image as VanImage } from 'vant';

createApp(App)
  .use(Swipe).use(SwipeItem).use(Lazyload, {
    loading: require('./assets/images/default.png')
  }).use(Badge).use(Sidebar).use(SidebarItem)
  .use(Collapse).use(CollapseItem)
  .use(Tab).use(Tabs).use(Card)
  .use(VanImage).use(Tag).use(Button)
  .use(Form).use(Field).use(SubmitBar)
  .use(Stepper).use(CheckboxGroup)
  .use(Checkbox).use(SwipeCell).use(Icon)
  .use(store).use(router).mount('#app')
