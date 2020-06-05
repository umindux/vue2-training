<template>
  <div class="login_page fillcontain">
    <div class="bg-img-container">
      <img :style="fixStyle" :src="PATH_TO_BG_IMG" />
    </div>
    <transition name="form-fade" mode="in-out">
      <section class="form_contianer" v-show="showLogin">
        <div class="manage_tip">
          <p>InsureMO-教學練習</p>
        </div>
        <el-form :model="loginForm" :rules="rules" ref="loginForm">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" placeholder="用户名"
              ><span>dsfsf</span></el-input
            >
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              placeholder="密碼"
              v-model="loginForm.password"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="submitForm('loginForm')"
              class="submit_btn"
              >登入</el-button
            >
          </el-form-item>
        </el-form>
        <p class="tip">練習用</p>
        <p class="tip">帳號密碼為ebao帳密</p>
      </section>
    </transition>
  </div>
</template>

<script>
import PATH_TO_BG_IMG from "@/assets/img/background2.jpg";
import { login, getAdminInfo } from "@/api/getData";
import { mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      PATH_TO_BG_IMG,
      fixStyle: "",
      loginForm: {
        username: "Henry.Chang@ebaotech.com",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "請輸入用戶名稱", trigger: "blur" }
        ],
        password: [{ required: true, message: "請輸入密碼", trigger: "blur" }]
      },
      showLogin: false
    };
  },
  mounted() {
    this.showLogin = true;
    if (!this.adminInfo.id) {
      this.getAdminData();
    }
    window.onresize = () => {
      const windowWidth = document.body.clientWidth;
      const windowHeight = document.body.clientHeight;
      const windowAspectRatio = windowHeight / windowWidth;
      let videoWidth;
      let videoHeight;
      if (windowAspectRatio < 0.5625) {
        videoWidth = windowWidth;
        videoHeight = videoWidth * 0.5625;
        this.fixStyle = {
          height: windowWidth * 0.5625 + "px",
          width: windowWidth + "px",
          "margin-bottom": (windowHeight - videoHeight) / 2 + "px",
          "margin-left": "initial"
        };
      } else {
        videoHeight = windowHeight;
        videoWidth = videoHeight / 0.5625;
        this.fixStyle = {
          height: windowHeight + "px",
          width: windowHeight / 0.5625 + "px",
          "margin-left": (windowWidth - videoWidth) / 2 + "px",
          "margin-bottom": "initial"
        };
      }
    };
    window.onresize();
  },
  computed: {
    ...mapState(["adminInfo"])
  },
  methods: {
    ...mapActions(["getAdminData"]),
    async submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          const res = await login({
            username: this.loginForm.username,
            password: this.loginForm.password
          });

          if (res.expire_in != 0) {
            this.adminInfo.access_token = res.access_token;
            this.adminInfo.user_name = this.loginForm.username;

            this.$message({
              type: "success",
              message: "登录成功"
            });

            this.$router.push("manage");
          } else {
            this.$message({
              type: "error",
              message: "查無此帳號或密碼錯誤!"
            });
          }
        } else {
          this.$notify.error({
            title: "错误",
            message: "请输入正确的用户名密码",
            offset: 100
          });
          return false;
        }
      });
    }
  },
  watch: {
    adminInfo: function(newValue) {
      if (newValue.id) {
        this.$message({
          type: "success",
          message: "检测到您之前登录过，将自动登录"
        });
        this.$router.push("manage");
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "../style/mixin";
.login_page {
  background-color: #324057;
}
.manage_tip {
  position: absolute;
  width: 100%;
  top: -100px;
  left: 0;
  p {
    font-size: 34px;
    color: #0000000;
  }
}
.form_contianer {
  .wh(320px, 210px);
  .ctp(320px, 210px);
  padding: 25px;
  border-radius: 5px;
  text-align: center;
  background-color: #fff;
  .submit_btn {
    width: 100%;
    font-size: 16px;
  }
}
.tip {
  font-size: 12px;
  color: red;
}
.form-fade-enter-active,
.form-fade-leave-active {
  transition: all 1s;
}
.form-fade-enter,
.form-fade-leave-active {
  transform: translate3d(0, -50px, 0);
  opacity: 0;
}
.bg-img-container > .blur {
  background-color: rgba(0, 0, 0, 0.4);
  height: 100vh;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
.bg-img-container > img {
  background-attachment: fixed;
  -webkit-filter: blur(6px);
  -moz-filter: blur(6px);
  -ms-filter: blur(6px);
  -o-filter: blur(6px);
  filter: blur(6px);
}
</style>
