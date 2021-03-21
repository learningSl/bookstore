<template>
  <div class="user">
    <div class="top">
      <div :class="!loginStatus?'disabled':''" class="left" @click="uploadHeadImg">
        <img :src="headImg" />
      </div>
      <div :class="loginStatus?'disabled':''" @click="userLogin" class="middle">
        <span>{{barTitle}}</span>
      </div>
      <div class="right">
        <span>></span>
      </div>
    </div>
    <div v-show="isShow" class="show">
      <section @click="()=>isShow=false" class="back"></section>
      <van-form class="login">
        <van-field
          size="large"
          v-model="username"
          label="用户名"
          placeholder="用户名"
          name="用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          size="large"
          v-model="password"
          type="password"
          label="密码"
          placeholder="密码"
          name="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
        <div v-show="showSvg" class="wrap">
          <input maxlength="4" placeholder="请输入验证码" v-model="svgText" />
          <div @click="switchSvg" class="inp" style="width:50%;heigth:.5rem;" v-html="svgData"></div>
        </div>
        <div
          @click="()=>{if(title=='登录'){title='注册';info='点击登录';showSvg=false}else{title='登录';info='没有账号,点击注册';showSvg=true;getSvg();}}"
          class="zc"
        >
          <span>{{info}}</span>
        </div>
        <div style="margin: .5rem .3rem .3rem .3rem;">
          <van-button round block type="info" @click="submit">{{title}}</van-button>
        </div>
      </van-form>
    </div>
    <van-grid :column-num="3">
      <van-grid-item @click="toCollection" icon="photo-o" text="我的收藏" />
      <van-grid-item @click="()=>$toast.fail('该功能暂未开放')" v-for="value in 5" :key="value" icon="photo-o" text="文字" />
    </van-grid>
    <div class="btn">
      <van-button @click="exit" size="large" type="danger">退出登录</van-button>
    </div>
  </div>
</template>
<script>
import { userLogin, login, register } from "../request/api";
export default {
  data() {
    return {
      isShow: false,
      username: "",
      password: "",
      title: "登录",
      info: "没有账号,点击注册",
      svgText: "",
      svgData: "",
      showSvg: true,
      headImg: require("../assets/default.jpg"),
      loginStatus: false,
      barTitle: "点击登录",
      user_id: ''
    };
  },
  created() {
    if(localStorage.getItem('userInfo')!=undefined){
      this.user_id = JSON.parse(localStorage.getItem('userInfo'))['user_id']
    }
    this.init();
  },
  methods: {
    toCollection(){
      let token = localStorage.getItem('token')
      if(token==undefined){
        this.$toast.fail('请先登录')
        return
      }
      this.$router.push({
        path:'/collection',
        query:{user_id:this.user_id}
      })
    },
    init() {
      let token = localStorage.getItem("token");
      if (!token) {
        this.loginStatus = false;
        this.headImg = require("../assets/default.jpg");
      } else {
        this.loginStatus = true;
        this.barTitle = JSON.parse(localStorage.getItem("userInfo")).username;
        this.headImg = localStorage.getItem("headImg");
      }
    },
    exit() {
      if(localStorage.removeItem("token")==undefined){
        this.$toast.fail('你已经退出了登录状态')
        return
      }
      localStorage.removeItem("token");
      localStorage.removeItem('userInfo')
      this.barTitle='立即登录'
      this.init();
      this.$toast.success('退出成功')
    },
    uploadHeadImg() {
      this.$router.push("/userInfoEdit");
      this.$emit("closeTarbar", false);
    },
    switchSvg() {
      this.getSvg();
    },
    submit() {
      if (this.username == "" || this.password == "") {
        return;
      }
      if (this.title == "登录") {
        if (this.svgText == "") {
          this.$toast.fail("请输入验证码");
          return;
        }
        login({
          username: this.username,
          password: this.password,
          svgText: this.svgText
        }).then(res => {
          if (res.data.status == 200) {
            this.$toast.success("登陆成功");
            localStorage.setItem("token", res.data.token);
            localStorage.setItem(
              "userInfo",
              JSON.stringify({
                username: res.data.username,
                user_id: res.data.user_id
              })
            );
            localStorage.setItem("headImg", res.data.headImg);
            this.loginStatus = true;
            this.headImg = res.data.headImg;
            this.barTitle = res.data.username;
            this.username = "";
            this.password = "";
            this.svgText = "";
            this.isShow = false;
          } else {
            this.$toast.success(res.data.msg);
            this.username = "";
            this.password = "";
            this.svgText = "";
            this.getSvg();
          }
        });
      } else {
        register({
          username: this.username,
          password: this.password
        }).then(res => {
          if (res.data.status == 200) {
            this.$toast.success(res.data.msg);
            this.title = "登录";
            this.showSvg = true;
            this.info = "没有账号,点击注册";
          } else {
            this.$toast.fail(res.data.msg);
            this.username = "";
            this.password = "";
          }
        });
      }
    },
    userLogin() {
      this.isShow = true;
      this.getSvg();
    },
    getSvg() {
      userLogin().then(res => {
        this.svgData = res.data;
      });
    }
  }
};
</script>
<style lang="less" scoped>
.disabled {
  pointer-events: none;
}
.user {
  width: 100%;
  height: 100%;
  // background: blue;
  .top {
    width: 100%;
    height: 1.5rem;
    background: #333;
    display: flex;
    color: white;
    .left {
      width: 35%;
      height: 100%;
      // background: red;
      img {
        display: block;
        width: 70%;
        height: 70%;
        margin: 0 auto;
        margin-top: 15%;
        border-radius: 50%;
        border: 0.01rem white solid;
      }
    }
    .middle {
      width: 35%;
      height: 100%;
      // background: yellow;
      display: flex;
      justify-content: left;
      align-items: center;
      span {
        font-size: 0.2rem;
        font-weight: normal;
      }
    }
    .right {
      width: 30%;
      height: 100%;
      // background: green;
      display: flex;
      justify-content: center;
      align-items: center;
      span {
        font-size: 0.2rem;
        font-weight: normal;
      }
    }
  }
}
.show {
  width: 100%;
  height: 80%;
  .login {
    position: absolute;
    top: 28%;
    left: 13%;
    box-sizing: border-box;
    background: white;
    font-size: 0.2rem;
    margin-right: 13%;
    width: 80%;
    .zc {
      width: 1rem;
      height: 0.3rem;
      position: absolute;
      right: 0;
      bottom: 1rem;
      color: orange;
      font-size: 0.05rem;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .wrap {
      width: 100%;
      height: 2%;
      display: flex;
      overflow: hidden;
      input {
        display: block;
        width: 50%;
        height: 0.4rem;
        border: none;
        border-bottom: 1px #efefef solid;
        font-size: 0.15rem;
        padding-left: 0.14rem;
      }
      .inp {
        /deep/svg {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .back {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: -99;
  }
}
</style>