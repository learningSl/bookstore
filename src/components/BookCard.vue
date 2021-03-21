<template>
    <div class="bookCard">
        <van-grid :center="false" height="3rem" :column-num="columNum">
          <van-grid-item
            style="height:1.5rem;"
            v-for="(item,index) in todaySuggestBooks"
            :key="index"
            @click="toDetail(item)"
          >
            <van-image
              style="display:block;margin:0 auto;"
              width="60%"
              height=".8rem"
              :src="item['small_img_name']"
            />
            <span style="font-size:.1rem;display:block;width:100%;text-align:center;">{{item['book_name']}}</span>
            <span style="font-size:.1rem;display:block;width:100%;text-align:center;margin-top:.08rem;color:red;padding-bottom:.1rem">{{item.price}}</span>
          </van-grid-item>
        </van-grid>
    </div>
</template>
<script>
export default {
    props: ['todaySuggestBooks','columNum'],
    methods: {
      toDetail(item){
        this.$router.push({
          path: '/detail',
          query:{...item}
        })
      }
    }
}
</script>


<style lang="less" scoped>
.bookCard {
    width: 100%;
    height: 100%;
    padding-bottom: .8rem;
}
</style>