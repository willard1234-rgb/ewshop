import { Notify } from 'vant';
import { createRouter, createWebHistory } from 'vue-router'
import store from '../store';

const Home = () => import('../views/home/Home');
const Categroy = () => import('../views/categroy/Categroy');
const Detail = () => import('../views/detail/Detail');
const Profile = () => import('../views/profile/Profile');
const ShopCart = () => import('../views/shopcart/ShopCart');
const Register = () => import('../views/profile/Register');
const Login = () => import('../views/profile/Login');

const routes = [
  {
    path: '/',
    name: 'DefaultHome',
    component: Home,
    meta: {
      title: '图书兄弟',
      isAuthRequired: true
    }
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: {
      title: '图书兄弟',
      isAuthRequired: true
    }
  },
  {
    path: '/categroy',
    name: 'Categroy',
    component: Categroy,
    meta: {
      title: '图书兄弟-商品分类',
      isAuthRequired: true
    }
  },
  {
    path: '/detail',
    name: 'Detail',
    component: Detail,
    meta: {
      title: '图书兄弟-商品详情'
    }
  },
  {
    path: '/shopcart',
    name: 'ShopCart',
    component: ShopCart,
    meta: {
      title: '图书兄弟-购物车',
      isAuthRequired: true
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: {
      title: '图书兄弟-个人中心',
      isAuthRequired: true
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      title: '图书兄弟-用户注册'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: '图书兄弟-用户登录'
    }
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  //没有登录的话，在这里到login
  if (to.meta.isAuthRequired && store.state.user.isLogin === false) {
    Notify('您还没有登录，请先登录')
    return next('/login');
  } else {
    next();
  }
  document.title = to.meta.title;
})

export default router
