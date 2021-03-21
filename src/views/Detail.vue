<template>
  <div class="detail">
    <van-nav-bar @click-left="goBack" title="书籍详情" left-text="返回" left-arrow>
      <template #right>
        <van-icon @click="$router.push('/search')" name="search" size="18" />
      </template>
    </van-nav-bar>
    <div class="img">
      <img :src="book_detail['big_img_name']" />
    </div>
    <div class="info">
      <div class="name">
        <span>{{book_detail['book_name']}}</span>
      </div>
      <div class="price">
        <div class="salePrice">{{book_detail['price']}}</div>
        <div class="oldPrice">
          定价:
          <s style="color:#666666">￥{{book_detail['original_price'].split('￥').pop()}}</s>
        </div>
      </div>
      <div class="active">
        <div v-for="(item,index) in book_detail['active_list']" :key="index" class="item">
          <span>{{item}}</span>
        </div>
      </div>
    </div>
    <div class="adsSwipper">
      <van-swipe :autoplay="3000">
        <van-swipe-item v-for="index in (book_detail['ads_img_url'].length-1)" :key="index">
          <img v-lazy="book_detail['ads_img_url'][index]" />
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="bookInfo">
      <div v-for="(item,index) in this.book_detail.inforLink" :key="index" class="item">
        <span>{{item}}</span>
      </div>
    </div>
    <div class="service">
      <div class="top">
        <span>
          <van-icon color="red" name="checked" />
          {{book_detail['service'][0]}}
        </span>
        <span>
          <van-icon color="red" name="checked" />
          {{book_detail['service'][1]}}
        </span>
      </div>
      <div class="bottom">
        <span>
          <van-icon color="red" name="checked" />
          {{book_detail['service'][2]}}
        </span>
      </div>
    </div>
    <div class="reminder">
      <span>{{book_detail.reminder}}</span>
    </div>
    <div class="ads_img">
      <img :src="book_detail['ads_img_url'][0]" />
    </div>
    <div class="imgTextDetal">
      <div class="wrap">
        <span>图文详情</span>
      </div>
    </div>
    <div class="content">
      <div v-show="baseInforExist" class="baseInfo">
        <div v-for="index in (book_detail.baseInfor.length-2)/2" :key="index" class="item">
          <div class="left">{{book_detail.baseInfor[index*2-2]}}</div>
          <div class="right">{{book_detail.baseInfor[index*2-1]}}</div>
        </div>
        <div class="item">
          <span>{{book_detail.baseInfor[book_detail.baseInfor.length-2]}}</span>
        </div>
        <div class="item">
          <span>{{book_detail.baseInfor[book_detail.baseInfor.length-1]}}</span>
        </div>
      </div>

      <div
        v-show="book_interviewExist"
        style="box-sizing: border-box;padding-left:.15rem;"
        class="book_interview"
      >
        <h3>内容简介</h3>
        <span>{{book_detail['book_interview']}}</span>
      </div>
      <div v-show="book_mulus" class="author">
        <h3>目录</h3>
        <div v-for="(item,index) in book_detail['book_mulus']" :key="index">
          <span style="line-height:.2rem;">{{item}}</span>
        </div>
      </div>
      <div v-show="author_interview" class="author">
        <h3>作者简介</h3>
        <p v-for="(item,index) in book_detail['author_interview']" :key="index">{{item}}</p>
      </div>
      <van-sku
        v-model="showSkku"
        :sku="sku"
        :goods="goods"
        :hide-stock="sku.hide_stock"
        @stepper-change="(num)=>{buyCount=num}"
        :disable-stepper-input="true"
      />
      <van-goods-action class="nav">
        <van-goods-action-icon icon="chat-o" text="客服" color="#ee0a24" />
        <van-goods-action-icon icon="cart-o" @click="$router.push('/cart')" text="购物车" color="#ee0a24" />
        <van-goods-action-icon
          icon="star-o"
          @click="collection"
          :text="isCollection?'已收藏':'收藏'"
          :color="isCollection?'#ee0a24':''"
        />
        <van-goods-action-button type="warning" @click="addCart" text="加入购物车" />
        <van-goods-action-button type="danger" @click="buyGood" text="立即购买" />
      </van-goods-action>
    </div>
  </div>
</template>

<script>
import {addCart,bookCollect} from '../request/api'
export default {
  data() {
    return {
      book_detail: {},
      baseInforExist: true,
      book_interviewExist: true,
      characteristicExist: true,
      author_interview: true,
      book_mulus: true,
      isCollection: false,
      showSkku: false,
      disableStepper:false,
      buyCount: 1,
      sku:{
        tree: [],
        hide_stock: false,
        price: '',
        // hide_quota:10
        // stock_num: 3
      },
      goods:{
        picture: 'http://localhost:3000/image/shouye/detail/201020101113s4885392.jpg'
      },
      _id:'',
      userId:'',
    };
  },
  async created() {
    this.$emit("closeTarbar", false);
    this.book_detail = this.$route.query;
    this.sku.price = this.book_detail.price.replace(/¥/,'')
    this._id = this.book_detail._id
    this.userId = JSON.parse(localStorage.getItem('userInfo'))['user_id']
    if(localStorage.getItem('token')!=undefined){
      let res = await bookCollect({_id:this._id,user_id:this.userId})
      if(res.data.status==200){
        this.isCollection = true
      }
    }
    if (this.book_detail.inforLink.length == 5) {
      this.book_detail.inforLink[2] =
        this.book_detail.inforLink[2] +
        this.book_detail["book_NO"] +
        this.book_detail.inforLink[3];
      this.book_detail.inforLink[3] = this.book_detail.inforLink[4];
      this.book_detail.inforLink.pop();
    }
    let list = this.book_detail["active_list"];
    if (typeof list == typeof "a") {
      this.book_detail["active_list"] = [this.book_detail["active_list"]];
    }
    if (this.book_detail.baseInfor == []) {
      this.baseInforExist = false;
    }
    if (this.book_detail["book_interview"] == "-1") {
      this.book_interviewExist = false;
    }
    if (typeof this.book_detail["book_mulus"] == typeof "a") {
      this.book_detail["book_mulus"] = [this.book_detail["book_mulus"]];
    }
    if (this.book_detail["book_mulus"][0] == "-1") {
      this.book_mulus = false;
    }
    if (typeof this.book_detail["book_interview"] != typeof "a") {
      this.book_detail["book_interview"] = this.book_detail[
        "book_interview"
      ][0];
    }
    if (this.book_detail.characteristic == undefined) {
      this.characteristicExist = false;
    } else if (this.book_detail.characteristic.length == 0) {
      this.characteristicExist = false;
    }
    if (this.book_detail["author_interview"] == undefined) {
      this.author_interview = false;
    } else if (this.book_detail["author_interview"].length == 0) {
      this.author_interview = false;
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    async collection() {
      this.isCollection = !this.isCollection;
      if (this.isCollection) {
        let res = await bookCollect({_id:this._id,isCollection:this.isCollection,user_id:this.userId})
        if(res.data.status == 200){
          this.$toast.success("收藏成功");
        }
      } else {
        let res = await bookCollect({_id:this._id,isCollection:this.isCollection,user_id:this.userId})
        if(res.data.status == 200){
          this.$toast.success("已取消收藏");
        }
      }
    },
    async addCart() {
      if(this.showSkku){
        let res = await addCart({_id:this._id,count:this.buyCount,user_id:this.userId})
        if(res.data.status==200){
          this.$toast.success('添加成功')
          this.showSkku = false
          return
        }
      }
      this.showSkku = true;
    },
    buyGood(){
      if(this.showSkku){
        this.$toast.success('购买成功')
      }
       this.showSkku = true;
    }
  },
  mounted() {
    this.$router.afterEach((to, from, next) => {
      window.scrollTo(0, 0);
    });
  },
  destroyed() {
    this.$emit("closeTarbar", true);
  }
};
</script>

<style lang="less" scoped>
.van-goods-action{
  z-index: 9999;
  border-top: 1px #ccc solid;
}
.detail {
  width: 100%;
  height: 100%;
  z-index: 9999;
  .img {
    width: 100%;
    height: 30%;
    margin-top: 0.2rem;
    img {
      display: block;
      width: 50%;
      height: 100%;
      margin: 0 auto;
    }
  }
  .info {
    margin-top: 0.1rem;
    width: 100%;
    height: 30%;
    .name {
      width: 100%;
      height: 0.5rem;
      display: flex;
      justify-content: left;
      box-sizing: border-box;
      align-items: center;
      padding-left: 0.2rem;
      font-size: 0.2rem;
      font-weight: bold;
    }
    .price {
      width: 100%;
      height: 0.3rem;
      display: flex;
      align-items: center;
      .salePrice {
        width: 75%;
        height: 100%;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        padding-left: 0.2rem;
        font-size: 0.2rem;
        color: red;
      }
      .oldPrice {
        width: 25%;
        height: 100%;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: right;
      }
    }
    .active {
      width: 100%;
      height: 1rem;
      padding-top: 0.1rem;
      .item {
        width: 100%;
        height: 0.3rem;
        box-sizing: border-box;
        color: red;
        display: flex;
        justify-content: left;
        padding-left: 0.1rem;
        align-items: center;
        margin-bottom: 0.2rem;
        span {
          border: 1px red solid;
          padding: 0.1rem 0.15rem;
        }
      }
    }
  }
  .adsSwipper {
    width: 100%;
    height: 1rem;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .bookInfo {
    width: 100%;
    height: 1.5rem;
    box-sizing: border-box;
    padding-top: 0.1rem;
    background: white;
    .item {
      box-sizing: border-box;
      width: 100%;
      height: 0.35rem;
      display: flex;
      align-items: center;
      border-bottom: 1px solid black;
      padding-left: 0.1rem;
    }
  }
  .service {
    width: 100%;
    height: 0.7rem;
    background: #f3f3f3;
    .top,
    .bottom {
      width: 100%;
      height: 0.3rem;
      display: flex;
      align-items: center;
      span {
        padding-left: 0.15rem;
        display: flex;
        align-items: center;
        .van-icon {
          box-sizing: border-box;
          padding-right: 0.05rem;
        }
      }
    }
  }
  .reminder {
    width: 100%;
    height: 0.5rem;
    background: white;
    font-size: 0.1rem;
    span {
      display: inline-block;
      line-height: 0.2rem;
      box-sizing: border-box;
      padding-top: 0.05rem;
      padding-left: 0.15rem;
      color: red;
    }
  }
  .ads_img {
    width: 100%;
    height: 1rem;
    img {
      width: 100%;
      height: 100%;
      display: block;
    }
  }
  .imgTextDetal {
    width: 100%;
    height: 0.8rem;
    background: #f3f3f3;
    display: flex;
    justify-content: center;
    align-items: center;
    .wrap {
      width: 100%;
      height: 0.5rem;
      background: white;
      box-shadow: 0 0.05rem 0.03rem #ccc;
      -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
      display: flex;
      justify-content: center;
      align-items: center;
      span {
        font-size: 0.2rem;
      }
    }
  }
  .content {
    width: 100%;
    box-sizing: border-box;
    padding-bottom: 0.5rem;
    .baseInfo {
      width: 100%;
      .item {
        width: 100%;
        height: 0.3rem;
        box-sizing: border-box;
        background: white;
        display: flex;
        flex-wrap: nowrap;
        padding-left: 0.15rem;
        padding-top: 0.1rem;
        font-size: 0.1rem;
        .left,
        .right {
          width: 50%;
          height: 100%;
        }
      }
    }
    .author {
      width: 100%;
      box-sizing: border-box;
      padding-left: 0.15rem;
    }
  }
}
</style>