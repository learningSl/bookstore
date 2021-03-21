<template>
  <div class="search">
    <van-search
      v-model="searchKey"
      show-action
      placeholder="请输入搜索关键词"
      @search="onSearch"
      @cancel="()=>{$router.go(-1);classNames='moveBack'}"
    />
    <div v-show="history.length==0?false:true" class="oldSearch">
        <div class="title">
            <span>搜索历史</span>
            <span @click="remove"><van-icon name="delete-o" /></span>
        </div>
        <div class="item">
            <van-tag @click="()=>{searchKey=item;onSearch()}" v-for="(item,index) in history" :key="index" size="large" type="default">{{item}}</van-tag>
        </div>
    </div>
    <van-empty v-show="isEmpty" image="search" :description="title" />
    <BookCard :todaySuggestBooks="bookList" columNum="2" />
  </div>
</template>

<script>
import {searchBook} from '../request/api'
import BookCard from '../components/BookCard'
export default {
    components:{
        BookCard
    },
    data() {
        return{
            searchKey: '',
            title: '搜一搜',
            history: [],
            bookList: [],
            isEmpty:true
        }
    },
    methods:{
        async onSearch(){
            if(this.searchKey==''){
                this.$toast.fail('请输入搜索关键字')
            }else{
                let flag = this.history.every(v=>{
                    if(v.trim().toLowerCase()==this.searchKey.trim().toLowerCase()){
                        return false
                    }
                    return true
                })
                if(flag){
                    this.history.push(this.searchKey)
                    localStorage.setItem('searchHistory',JSON.stringify(this.history))
                }
                let res = await searchBook({searchKey:this.searchKey.trim()})
                if(res.data.status == 200){
                    this.bookList = res.data.data
                    if(this.bookList.length!=0){
                        this.history = []
                        this.isEmpty = false
                    }else{
                        this.isEmpty = true
                        this.title = '空空如也'
                    }
                }
            }
        },
        remove(){   
            localStorage.removeItem('searchHistory')
            this.history = []
            this.$toast.success('删除成功')
        }
    },
    created(){
        let search = JSON.parse(localStorage.getItem('searchHistory'))
        if(search != undefined){
            if(search.length > 0){
                this.history = search
            }
        }
    }
}
</script>
<style lang="less" scoped>
.search{
    width: 100%;
    height: 100%;
    background: white;
    .oldSearch{
        width: 100%;
        height: 1rem;
        .title{
            width: 100%;
            height: .5rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: .2rem;
            box-sizing: border-box;
            padding-left:.15rem;
            border-bottom: 1px #ccc solid;
            span{
                display: flex;
                justify-content:center;
                align-items: center;
                padding-right:.15rem;
            }
        }
        .item{
            box-sizing: border-box;
            padding-left:.15rem;
            padding-top:.15rem;
            .van-tag{
                margin-right:.15rem;
            }
        }
    }
}
.moveTo{
    animation:switchTo 1s linear;
}
.moveBack{
    animation:switchBack 1s linear;
    animation-direction: alternate;
}
@keyframes switchTo{
    from {
        width: 100%;
    }
    to{
        width: -100%;
    }
}
@keyframes switchBack{
    from {
        width: 100%;
    }
    to{
        width: 0;
    }
}
</style>