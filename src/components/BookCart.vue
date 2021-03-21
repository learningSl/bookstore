<template>
  <div class="bookCart">
    <div class="item">
        <van-checkbox @click="change" :value="checked"></van-checkbox>
        <van-swipe-cell>
        <van-card
          style="background:white;border-radius:.1rem;"
          :price="price"
          :title="name"
          :thumb="picture"
          @click="$router.push({path:'/detail',query:{...book}})"
        >
          <template #footer>
            <div class="step">
              <van-button @click="sub" size="mini">-</van-button>
              <div class="tag">
                <van-tag plain type="default">{{count}}</van-tag>
              </div>
              <van-button @click="add" size="mini">+</van-button>
            </div>
          </template>
        </van-card>
        <template #right>
          <van-button @click="removeCartBook" text="删除" type="danger" class="delete-button"></van-button>
        </template>
      </van-swipe-cell>
    </div>
  </div>
</template>
<script>
export default {
  props: ["count", "name", "picture", "price", "checked", "book"],
  data() {
    return {
      // checked: true
    };
  },
  methods: {
    removeCartBook(){
      this.$emit('removeCartBook')
    },
    sub() {
      this.$emit("changeCount", false);
    },
    add() {
      this.$emit("changeCount", true);
    },
    change() {
      this.$emit("change");
    }
  }
};
</script>
<style lang="less" scoped>
.van-swipe-cell__right{
  width: 100%;
  height: 100%;
}
.delete-button{
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border-radius: .1rem;
  margin-left: .001rem;
  margin-top: .02rem;
  padding-left: .1rem;
}
.van-checkbox {
  position: absolute;
  top: 40%;
  left: 2%;
  z-index: 99;
}
.bookCart {
  width: 100%;
  height: 1.5rem;
  margin-top: -10%;
  margin-bottom: 10%;
  .item {
    margin: 0 auto;
    width: 90%;
    height: 90%;
    background: white;
    border-radius: 0.1rem;
    box-sizing: border-box;
    padding-left: 0.3rem;
    position: relative;
  }
}
.van-tag {
  display: inline-block;
  margin-left: 0.05rem;
  border: none;
  border-radius: 0;
}
.step {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: 0 auto;
  .van-button {
    width: 0.3rem;
  }
}
</style>