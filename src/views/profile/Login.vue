<template>
  <div>
    <nav-bar>
      <template v-slot:default>新用户注册</template>
    </nav-bar>
    <div style="magin-top: 50px">
      <div style="text-align: center">
        <van-image
          width="10rem"
          height="10rem"
          fit="contain"
          src="assets/images/user.png"
        />
      </div>
    </div>
    <van-form @submit="onSubmit">
      <van-field
        v-model="email"
        type="email"
        name="邮箱"
        label="邮箱"
        placeholder="邮箱"
        :rules="[{ required: true, message: '请填写邮箱' }]"
      />
      <van-field
        v-model="password"
        type="password"
        name="密码"
        label="密码"
        placeholder="密码"
        :rules="[{ required: true, message: '请填写密码' }]"
      />
      <div style="margin: 16px">
        <div class="link-login" @click="$router.push({ path: './register' })">
          没有账号，立即注册
        </div>
        <van-button
          round
          block
          type="info"
          color="#1989fa"
          native-type="submit"
        >
          提交
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar.vue";
import { reactive, toRefs } from "vue";
import { useRouter } from "vue-router";
import { login } from "network/user";
import { Toast } from "vant";
import { useStore } from "vuex";
export default {
  name: "Login",
  components: { NavBar },
  setup() {
    const router = useRouter();
    const store = useStore();
    const userinfo = reactive({
      email: "",
      password: "",
    });
    const onSubmit = () => {
      login(userinfo).then((res) => {
        // 将token保存在本地window.localStorage
        window.localStorage.setItem("token", res.access_token);
        store.commit("setIsLogin", true);
        Toast.success("登录成功");
        userinfo.email = "";
        userinfo.password = "";
        setTimeout(() => {
          router.push({ path: "/home" });
        }, 500);
      });
    };

    return {
      ...toRefs(userinfo),
      onSubmit,
    };
  },
};
</script>

<style>
.link-login {
  font-size: 14px;
  margin-bottom: 20px;
  color: #42b983;
}
</style>