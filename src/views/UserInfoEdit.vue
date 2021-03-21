<template>
  <div class="userInfoEdit">
    <van-nav-bar @click-left="$router.go(-1)" title="标题" left-text="返回" left-arrow>
      <template #right>
        <van-icon name="search" size="18" />
      </template>
    </van-nav-bar>
    <div class="img" @click="uploadHeadImg">
      <img :src="imgSrc" />
      <input id="headPic" style="display:none" name="file" type="file" accept="image/*" />
    </div>
    <div class="wrap">
      <van-form style="background:white;">
        <van-field label="用户名" v-model="username" readonly />
        <van-field
          label="真实姓名"
          :autofocus="isEdit?true:false"
          placeholder="补充个人信息吧!!!"
          v-model="realName"
          :readonly="isEdit?false:true"
        />
        <van-field label="性别" placeholder="补充个人信息吧!!!" v-model="sex" :readonly="isEdit?false:true" />
        <van-field
          label="联系电话"
          placeholder="补充个人信息吧!!!"
          v-model="phone"
          :readonly="isEdit?false:true"
        />
        <van-field
          @click="showPicker=true"
          v-model="userBirth"
          label="我的生日"
          :class="isEdit?'':'disabled'"
          placeholder="补充个人信息吧!!!"
          clickable
          readonly
        />
        <van-datetime-picker
          v-show="showPicker"
          @cancel="showPicker=false"
          @confirm="timeFinish"
          v-model="birth"
          type="date"
          title="选择年月日"
        />
        <van-field
          type="textarea"
          label="个性签名"
          placeholder="补充个人信息吧!!!"
          v-model="signName"
          :readonly="isEdit?false:true"
        />
        <div style="margin: .12rem;">
          <van-button round block :type="isEdit? 'primary':'info'" @click="submit">{{title}}</van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import { getUserInfo, updateUserInfo, uploadImg } from "../request/api";
import { Toast } from "vant";
export default {
  data() {
    return {
      imgSrc: "",
      username: "",
      realName: "",
      sex: "",
      phone: "",
      userBirth: "",
      createTime: "",
      signName: "",
      title: "点击编辑信息",
      isEdit: false,
      showPicker: false,
      birth: "",
      headImg: new FormData(),
      changeExed: false,
      user_id: ""
    };
  },
  methods: {
    init() {
      this.$emit("closeTarbar", false);
      this.imgSrc = localStorage.getItem("headImg");
      let info = JSON.parse(localStorage.getItem("userInfo"));
      this.user_id = info["user_id"];
      getUserInfo({ user_id: info["user_id"] }).then(res => {
        let data = res.data;
        if (data.status == 200) {
          this.username = data.username;
          this.realName = data.realName;
          this.sex = data.sex;
          this.phone = data.phone;
          this.createTime = data.createTime;
          this.userBirth = data.userBirth;
          this.signName = data.signName;
        }
      });
    },
    uploadHeadImg() {
      let _that = this;
      let inputs = document.getElementById("headPic");
      inputs.addEventListener("change", function(e) {
        if (!this.changeExed) {
          this.changeExed = true;
          this.headImg = new FormData();
          this.headImg.append("file", e.target.files[0]);
          let { user_id } = JSON.parse(localStorage.getItem("userInfo"));
          this.headImg.append("user_id", user_id);
          uploadImg(this.headImg).then(res => {
            if (res.data.status == 200) {
              _that.imgSrc = res.data.headImg;
              localStorage.setItem("headImg", res.data.headImg);
              _that.init();
              Toast.success("上传成功");
            } else {
              Toast.fail("上传失败");
            }
          });
        }
      });
      let res = inputs.click();
    },
    timeFinish() {
      this.showPicker = false;
      if (this.birth == "") {
        return false;
      } else {
        let d = new Date(this.birth);
        let year = d.getFullYear();
        let month = d.getMonth() + 1;
        let day = d.getDate();
        this.userBirth = year + "-" + month + "-" + day;
      }
    },
    submit() {
      if (!this.isEdit) {
        console.log(22);
        this.isEdit = true;
        this.title = "修改";
      } else {
        this.isEdit = false;
        this.title = "点击编辑信息";
        updateUserInfo({
          realName: this.realName,
          sex: this.sex,
          phone: this.phone,
          userBirth: this.userBirth,
          signName: this.signName,
          user_id: this.user_id
        }).then(res => {
          if (res.data.status == 200) {
            Toast.success("修改成功");
            this.init();
          } else {
            Toast.fail("修改失败");
          }
        });
      }
    }
  },
  created() {
    this.init();
  },
  destroyed() {
    this.$emit("closeTarbar", true);
  }
};
</script>
<style lang="less" scoped>
.userInfoEdit {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  .img {
    width: 40%;
    height: 20%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    margin-top: 10%;
    img {
      display: block;
      width: 80%;
      height: 80%;
      border-radius: 50%;
    }
  }
  .wrap {
    margin: 0 auto;
    width: 80%;
    height: 60%;
  }
}
.disabled {
  pointer-events: none;
}
</style>