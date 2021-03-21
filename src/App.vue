<template>
  <div id="app">
    <router-view />
    <van-tabbar v-show="flag" route v-model="active">
      <van-tabbar-item to="/home" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/category" icon="apps-o">分类</van-tabbar-item>
      <van-tabbar-item to="/cart" icon="shopping-cart-o">购物车</van-tabbar-item>
      <van-tabbar-item to="/user" icon="friends-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
export default {
  data() {
    return {
      active: 0,
      flag: true
    };
  },
  created() {
    this.flag = true;
  },
  methods: {
    closeTarbar(flag) {
      this.flag = flag;
    }
  },
  watch: {
    $route: {
      handler: function(to, from) {
        if (to.path == "/detail") {
          this.closeTarbar(false);
        }
        if (to.path == "/moreTodayBook" || to.path=="/search" || to.path=="/userInfoEdit" || to.path=="/collection") {
          this.closeTarbar(false);
        }
        if(to.path=="/home" || to.path=='/cart' || to.path=='/user' || to.path=='/category'){
          this.closeTarbar(true)
        }
      },
      deep: true
    }
  }
};
</script>
<style lang="less">
html,
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
html {
  font-size: 100px;
  width: 100%;
  height: 100%;
  // padding-bottom: 0.5rem;
  // background: #f3f3f3;
}
body {
  font-size: 0.14rem;
  width: 100%;
  height: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
.van-tabbar{
  z-index: 99;
}
</style>
