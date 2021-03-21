<template>
  <div>
    <van-tabs border title-active-color="skyblue" @click="switchTab" v-model="active">
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
  components:{
      BookCard
  },
  data() {
    return {
      active: 0,
      getShouyeOrder:[]
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
  created() {
      this.getOrder()
  }
};
</script>

<style lang="less" scoped>
.van-sidebar-item--select::before {
  width: 0.04rem;
  height: 100%;
}
</style>