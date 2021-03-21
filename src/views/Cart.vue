<template>
  <div class="cart">
    <div class="title">
      <div class="top">
        <span>购物车</span>
        <span>管理</span>
      </div>
      <div class="count">
        <span>共{{bookCount}}件商品</span>
      </div>
    </div>
    <div v-show="!isEmpty" class="bg">
      <BookCart
        @changeCount="(flag)=>changeCount(index,item.cart.count,item.cart._id,flag)"
        @change="change(index, item.cart.checked, item.cart._id)"
        @removeCartBook="removeCartBook(item.cart._id)"
        v-for="(item,index) in cartGoods"
        :checked="item.cart.checked"
        :price="item.book.price.replace(/¥/,'')"
        :picture="item.book['small_img_name']"
        :name="item.book['book_name']"
        :count="item.cart.count"
        :key="index"
        :book="item.book"
      />
    </div>
    <van-empty v-show="isEmpty" image="https://img01.yzcdn.cn/vant/custom-empty-image.png" description="空空如也" />
    <van-submit-bar :price="totalPrice*100" button-text="提交订单" @submit="onSubmit">
      <van-checkbox @click="itemCheck" v-model="checked">全选</van-checkbox>
    </van-submit-bar>
  </div>
</template>

<script>
import BookCart from "../components/BookCart";
import { getCart, changeCount, removeCartBook } from "../request/api";
export default {
  components: {
    BookCart
  },
  data() {
    return {
      cartGoods: [],
      user_id: "",
      bookCount: 0,
      totalPrice: 0,
      checked: true,
      isEmpty:true
    };
  },
  methods: {
    async itemCheck() {
      let res = await changeCount({ user_id:this.user_id, checked: this.checked,allChange:true });
      if (res.data.status != 200) {
        this.$toast.fail("修改失败");
        return;
      }
      this.cartGoods.forEach(item=>{
        item.cart.checked = this.checked
      })
      this.init();
    },
    async removeCartBook(id) {
      let res = await removeCartBook({ id, flag: true });
      if (res.data.status != 200) {
        this.$toast.fail("删除失败");
      }
      this.init();
    },
    async change(index, checked, cart_id) {
      this.cartGoods[index].cart.checked = !this.cartGoods[index].cart.checked;
      let res = await changeCount({ cart_id, checked: !checked });
      if (res.data.status != 200) {
        this.$toast.fail("修改失败");
        return;
      }
      this.init();
    },
    async changeCount(index, count, cart_id, flag) {
      if (!flag) {
        if (count == 1) {
          return;
        }
        this.cartGoods[index].cart.count--;
      } else {
        this.cartGoods[index].cart.count++;
      }
      let res = await changeCount({ count, cart_id, flag });
      if (res.data.status != 200) {
        this.$toast.fail("修改失败");
        return;
      }
      this.init();
    },
    onSubmit() {},
    async init() {
      let res = await getCart({ user_id: this.user_id });
      if (res.data.status == 200 && res.data.cart == 1) {
        this.isEmpty = false;
        this.cartGoods = res.data["book_list"];
        this.totalPrice = res.data.totalPrice;
        this.bookCount = this.cartGoods.length;
        this.checked = this.cartGoods.every(item => {
          if (!item.cart.checked) {
            return false;
          }
          return true;
        });
      }else{
        this.isEmpty = true;
      }
    }
  },
  created() {
    let user_id = JSON.parse(localStorage.getItem("userInfo"))["user_id"];
    this.user_id = user_id;
    this.init();
  }
};
</script>
<style lang="less" scoped>
.cart {
  width: 100%;
  height: 100%;
  padding-bottom: 0.5rem;
  position: relative;
  background: #f3f3f3;
  .title {
    width: 100%;
    height: 27%;
    background: linear-gradient(to bottom, #ff8917, #ee0a24);
    z-index: 0;
    .top {
      width: 100%;
      height: 0.6rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      span {
        box-sizing: border-box;
        padding-left: 0.2rem;
        padding-right: 0.2rem;
        color: white;
        &:first-child {
          font-size: 0.25rem;
        }
      }
    }
    .count {
      width: 100%;
      height: 0.4rem;
      span {
        box-sizing: border-box;
        padding-left: 0.2rem;
        color: white;
      }
    }
  }
  .bg {
    width: 100%;
    // height: 100%;
    background: #f3f3f3;
    position: absolute;
    top: 15%;
    left: 0;
    box-sizing: border-box;
    padding-bottom: 0.6rem;
    margin-top: 10%;
    // margin-bottom: -10%;
  }
}
.van-submit-bar {
  border-top: 1px #ccc solid;
  margin-bottom: 13%;
  border-bottom: 1px #ccc solid;
}
</style>