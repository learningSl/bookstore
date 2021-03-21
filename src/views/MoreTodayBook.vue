<template>
  <div class="moreTodayBook">
    <van-nav-bar  @click-left="$router.go(-1)" title="新书上架 限时特惠" left-text="返回" left-arrow>
      <template #right>
        <van-icon name="search" size="18" />
      </template>
    </van-nav-bar>
    <div class="img">
        <img src="../assets//mbannerx.jpg" />
    </div>
    <div class="content">
        <div class="title">
            <span>主打推荐</span>
        </div>
        <div class="list">
            <BookCard :todaySuggestBooks="allTodayBook" columNum="2" />
        </div>
    </div>
  </div>
</template>

<script>
import BookCard from '../components/BookCard'
import {getAllTodayBook} from '../request/api'
export default {
    components: {
        BookCard
    },
  data() {
    return {
      searchKey: "",
      allTodayBook:[]
    };
  },
  async created() {
    this.$emit("closeTarbar", false);
    let res = await getAllTodayBook()
    if(res.data.status == 200){
        this.allTodayBook = res.data.data
    }
  },
  destroyed() {
    this.$emit("closeTarbar", true);
  },
  mounted() {
      this.$router.afterEach((to, from, next) => {
        window.scrollTo(0, 0)
    })
  }
};
</script>

<style lang="less" scoped>
.moreTodayBook{
    width: 100%;
    height: 100%;
    background: #f3f3f3;
    box-sizing: border-box;
    padding-bottom: 1rem;
    .img{
        width: 100%;
        height: 40%;
        img{
            width: 100%;
            height: 100%;
            display: block;
        }
    }
    .content{
        width: 100%;
        .title{
            width: 100%;
            height: .5rem;
            font-size: .2rem;
            text-align: center;
            position: relative;
            background: white;
            span{
                line-height: .5rem;
                color:red;
                &::before{
                    content: '';
                    width: .01rem;
                    height: 40%;
                    position: absolute;
                    top:30%;
                    left:50%;
                    background: red;
                    margin-left:-15%;
                }
                &::after{
                    content: '';
                    width: .01rem;
                    height: 40%;
                    position: absolute;
                    top:30%;
                    left:65%;
                    background: red;
                }
            }
        }
        .list{
            width: 100%;
        }
    }
}
</style>