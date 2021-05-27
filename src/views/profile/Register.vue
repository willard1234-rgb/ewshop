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
        v-model="name"
        name="用户名"
        label="用户名"
        placeholder="用户名"
        :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
        v-model="password"
        type="password"
        name="密码"
        label="密码"
        placeholder="密码"
        :rules="[{ required: true, message: '请填写密码' }]"
      />
      <van-field
        v-model="password_confirmation"
        type="password"
        name="确认密码"
        label="确认密码"
        placeholder="确认密码"
        :rules="[{ required: true, message: '请确认密码' }]"
      />
      <van-field
        v-model="email"
        name="邮箱"
        label="邮箱"
        placeholder="邮箱"
        :rules="[{ required: true, message: '请填写邮箱' }]"
      />
      <div style="margin: 16px">
        <div class="link-login" @click="$router.push({ path: './login' })">
          已有账号，立即登录
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
import { register } from "network/user";
import { Notify, Toast } from "vant";
import { useRouter } from "vue-router";
export default {
  name: "Register",
  components: { NavBar },
  setup() {
    const router = useRouter();
    const userinfo = reactive({
      name: "",
      password: "",
      password_confirmation: "",
      email: "",
    });
    const onSubmit = () => {
      // 先验证
      if (userinfo.password != userinfo.password_confirmation) {
        Notify("密码不一致");
      } else {
        //提交给服务器
        register(userinfo).then((res) => {
          console.log(res);
          if (res.status == "201") {
            Toast.success("注册成功");
            setTimeout(() => {
              router.push({ path: "/login" });
            }, 1000);
          }
          userinfo.password_confirmation = "";
          userinfo.password = "";
        });
      }
    };

    return {
      onSubmit,
      ...toRefs(userinfo),
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