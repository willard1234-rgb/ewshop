import axios from 'axios';
import { Notify, Toast } from "vant";
import router from '../router';

export function request(config) {
  const instance = axios.create({
    baseURL: 'https://api.shop.eduwork.cn/',
    timeout: 5000
  })

  //请求拦截
  instance.interceptors.request.use(config => {
    //如果有接口需要认证才能访问，就在这里统一设置
    const token = window.localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
  }, err => {
    console.log(err);
  })

  //响应拦截
  instance.interceptors.response.use(res => {
    return res.data ? res.data : res;
  }, err => {
    //如果需要授权才能访问接口，统一去login授权
    if (err.response.status == '401') {
      Toast.fail('请先登录')
      router.push({ path: '/login' });

    }
    //如果有错误，在这里面处理,显示错误信息
    Notify(err.response.data.errors[Object.keys(err.response.data.errors)[0]][0]);
  })

  return instance(config);
}