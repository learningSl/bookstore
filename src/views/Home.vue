<template>
  <div class="home">
    <div @click="$router.push('/search')">
      <van-search readonly v-model="searchKey" placeholder="请输入搜索关键词" />
    </div>
    <van-swipe style="width:100%;height:30%;" :autoplay="3000">
      <van-swipe-item v-for="(image, index) in swipperImages" :key="index">
        <img width="100%" height="100%" v-lazy="image" />
      </van-swipe-item>
    </van-swipe>
    <van-grid height=".7rem" :column-num="5">
      <van-grid-item v-for="(item,index) in shouyeSort" :key="index" :text="item.sort">
        <van-image style="display:block" height=".5rem" :src="item.imgUrl" />
        <span style="font-size:.1rem">{{item.sort}}</span>
      </van-grid-item>
    </van-grid>
    <van-notice-bar left-icon="volume-o" :scrollable="false">
      <van-swipe vertical class="notice-swipe" :autoplay="3000" :show-indicators="false">
        <van-swipe-item>2021春节假期公告</van-swipe-item>
        <van-swipe-item>疫情期间发货公告</van-swipe-item>
        <van-swipe-item>新用户注册即送10元</van-swipe-item>
      </van-swipe>
    </van-notice-bar>
    <van-swipe style="width:100%;height:20%;" :autoplay="3000">
      <van-swipe-item v-for="(image, index) in middleSwipper" :key="index">
        <img width="100%" height="100%" v-lazy="image.imgUrl" />
      </van-swipe-item>
    </van-swipe>
    <div class="today">
      <div class="top">
        <div class="left">
          <span>今日值得买</span>
        </div>
        <div class="right">
          <van-button @click="$router.push('/moreTodayBook')">更多&nbsp;></van-button>
        </div>
      </div>
      <div class="content">
        <BookCard :todaySuggestBooks="todaySuggestBooks" columNum="3" />
      </div>
    </div>
    <div class="order">
      <div class="top">
        <img src="../assets//changxiaobangtitle.png" />
      </div>
      <div class="wrap">
        <van-tabs border title-active-color="skyblue" @click="switchTab" v-model="active">
          <van-tab title="总榜">
            <BookCard columNum="2" :todaySuggestBooks="getShouyeOrder" />
          </van-tab>
          <van-tab title="文学">
            <BookCard columNum="2" :todaySuggestBooks="getShouyeOrder" />
          </van-tab>
          <van-tab title="社科">
            <BookCard columNum="2" :todaySuggestBooks="getShouyeOrder" />
          </van-tab>
          <van-tab title="少儿">
            <BookCard columNum="2" :todaySuggestBooks="getShouyeOrder" />
          </van-tab>
          <van-tab title="艺术">
            <BookCard columNum="2" :todaySuggestBooks="getShouyeOrder" />
          </van-tab>
        </van-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getSwipper,
  getShouyeSort,
  getmiddleSwipper,
  todaySuggestBook,
  getShouyeOrder
} from "../request//api";
import BookCard from "../components/BookCard";
export default {
  components: {
    BookCard
  },
  data() {
    return {
      searchKey: "",
      swipperImages: [],
      shouyeSort: [],
      middleSwipper: [],
      todaySuggestBooks: [],
      active:0,
      getShouyeOrder:[],
      showOrder:[]
    };
  },
  methods: {
    async getOrder(params={}){
      let data = await getShouyeOrder(params)
      if(data.data.status == 200){
        this.getShouyeOrder = []
        this.getShouyeOrder = data.data.data
      }
    },
    switchTab(name,title){
      if(name==0){
        this.getOrder()
        return
      }
      this.getOrder({sort:title})
    }
  },
  async created() {
    let res = await getSwipper();
    if (res.data.status == 200) {
      res.data.data.forEach(item => {
        this.swipperImages.push(item.imgUrl);
      });
    }
    let shouyeSort = await getShouyeSort();
    if (shouyeSort.data.status == 200) {
      this.shouyeSort = shouyeSort.data.data;
    }
    let middleSwipper = await getmiddleSwipper();
    if (middleSwipper.data.status == 200) {
      this.middleSwipper = middleSwipper.data.data;
    }
    let todaySuggestBooks = await todaySuggestBook();
    if (todaySuggestBooks.data.status == 200) {
      this.todaySuggestBooks = todaySuggestBooks.data.data;
    }
    this.getOrder()
  },
  mounted() {
      this.$router.afterEach((to, from, next) => {
        window.scrollTo(0, 0)
    })
  }
};
</script>

<style lang="less" scoped>
.home {
  width: 100%;
  height: 100%;
  margin-bottom: 40%;
  background: #f3f3f3;
  
}
/deep/.van-swipe__track {
  width: 100%;
  height: 100%;
}
.notice-swipe {
  height: 0.4rem;
  line-height: 0.4rem;
}
.today {
  width: 100%;
  height: 51%;
  margin-top: 0.1rem;
  .top {
    width: 100%;
    height: 12%;
    background: #f9bd00;
    display: flex;
    justify-content: left;
    align-items: center;
    .left {
      width: 80%;
      height: 100%;
      display: flex;
      justify-content: left;
      align-items: center;
      padding-left: 0.1rem;
      color: white;
    }
    .right {
      width: 20%;
      height: 100%;
      text-align: right;
      font-weight: normal;
      vertical-align: middle;
      display: inline-flex;
      align-items: center;
      .van-button {
        height: 50%;
        opacity: 0.5;
        border: none;
      }
    }
  }
  .content {
    width: 100%;
    height: 73%;
    background: #f3f3f3;
  }
}
.order {
  width: 100%;
  height: 120%;
  background: #f3f3f3;
  padding-top: 0.4rem;
  margin-bottom: 40%;
  .top {
    width: 100%;
    height: 0.4rem;
    background: white;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 50%;
      height: 50%;
    }
  }
  .wrap{
    width: 100%;
    height: 100%;
    margin-top: .15rem;
  }
}
</style>
