import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

//解决路由守卫报的错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location,onResolve,onReject){
  if(onResolve || onReject){
    return originalPush.call(this,onResolve, onReject)
  }
  return originalPush.call(this,location).catch(err => err)
}


const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path:'/category',
    component: ()=>import('../views/Category')
  },
  {
    path:'/cart',
    component: ()=>import('../views/Cart')
  },
  {
    path:'/user',
    component: ()=>import('../views/User')
  },
  {
    path: '/userInfoEdit',
    component: ()=>import('../views/UserInfoEdit')
  },
  {
    path: '/detail',
    component: ()=>import('../views/Detail')
  },
  {
    path:'/moreTodayBook',
    component: ()=>import('../views/MoreTodayBook')
  },
  {
    path: '/search',
    component: ()=>import('../views/Search')
  },
  {
    path:'/collection',
    component: ()=>import('../views/Collection')
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to,from,next)=>{
  let token = localStorage.getItem('token')
  if(to.path==='/cart'){
    if(token){
      next()
    }else {
      Vue.prototype.$toast.fail('请先登录')
      next('/user')
    }
    return false;
  }
  next()
})

export default router
