<template>
  <div class="collection">
    <van-nav-bar @click-left="$router.go(-1)" @click-right="$router.push('/search')" title="我的收藏" left-text="返回" left-arrow>
      <template #right>
        <van-icon name="search" size="18" />
      </template>
    </van-nav-bar>
    <van-empty v-show="isEmpty" description="你还没有任何收藏哦" />
    <CollectCard v-for="(item,index) in collectList" :key="index" :book="item.book" />
  </div>
</template>


<script>
import { getCollect } from "../request/api";
import CollectCard from '../components//CollectCard' 
export default {
  components:{
      CollectCard
  },
  data() {
    return {
      user_id: "",
      collectList: [],
      isEmpty: true
    };
  },
  created() {
    this.user_id = this.$route.query["user_id"];
    this.init();
  },
  methods: {
    async init() {
      let res = await getCollect({ user_id: this.user_id });
      if (res.data.status == 200 && res.data.collection == 1) {
        this.isEmpty = false;
        this.collectList = res.data.data;
      } else {
        this.isEmpty = true;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.collection{
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    background: #f3f3f3;
}
</style>