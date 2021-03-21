<template>
    <div @click="$router.push({path:'/detail',query:{...book}})" class="card">
        <div class="left">
            <img :src="book['small_img_name']" />
        </div>
        <div class="right">
            <div class="top">
                <span>{{book['book_name']}}</span>
            </div>
            <div class="top a">
                <span>{{book['price']}}</span>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: ['book']
}
</script>

<style lang="less" scoped>
.card{
    width: 90%;
    height: 1.2rem;
    background: white;
    margin:0 auto;
    display: flex;
    border-radius:.1rem;
    justify-content:center;
    align-items:center;
    margin-top:.2rem;
    .left {
        width: 30%;
        height: 80%;
        margin-left: .3rem;
        img{
            width: 100%;
            height: 100%;
            display: block;
        }
    }
    .right{
        width: 60%;
        height: 100%;
        .top {
            width: 100%;
            height: 50%;
            display: flex;
            align-items:center;
            box-sizing: border-box;
            padding-left: .3rem;
        }
        .a{
            color: red;
        }
    }
}
</style>