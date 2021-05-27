<template>
  <div id="home">
    <nav-bar>
      <template v-slot:default>图书兄弟</template>
    </nav-bar>
    <tab-control
      v-show="isFixed"
      @tabClick="tabClick"
      :titles="['畅销', '新书', '精选']"
    ></tab-control>

    <div class="wrapper">
      <div class="content">
        <div ref="banref">
          <home-swiper :banners="banners"></home-swiper>
          <recommend-view :recommends="recommends"></recommend-view>
        </div>

        <tab-control @tabClick="tabClick" :titles="['畅销', '新书', '精选']">
        </tab-control>

        <goods-list :goods="showGoods"></goods-list>
      </div>
    </div>
    <back-top @bTop="bTop" v-show="isFixed"></back-top>
  </div>
</template>

<script>
import HomeSwiper from "./ChildComps/HomeSwiper";
import NavBar from "components/common/navbar/NavBar";
import RecommendView from "./ChildComps/RecommendView";
import TabControl from "components/content/tabControl/TabControl";
import GoodsList from "components/content/goods/GoodsList";
import BackTop from "components/common/backtop/BackTop";
import { getHomeAllData, getHomeGoods } from "network/home";
import { onMounted, ref, reactive, computed, watchEffect, nextTick } from "vue";
import BetterScroll from "better-scroll";
export default {
  name: "Home",
  setup() {
    let isFixed = ref(false);
    let banref = ref(null);
    const recommends = ref([]);
    //申明商品数据模型
    const goods = reactive({
      sales: { page: 1, list: [] },
      new: { page: 1, list: [] },
      recommend: { page: 1, list: [] },
    });
    //currentType初始为畅销，通过点击事件把不同的值传过来，再用计算属性把当前页面的list以props传给子组件
    let currentType = ref("sales");
    const showGoods = computed(() => {
      return goods[currentType.value].list;
    });

    let bscroll = reactive({});
    let banners = ref([]);
    onMounted(() => {
      //通过接口取得数据
      getHomeAllData().then((res) => {
        recommends.value = res.goods.data;
        banners.value = res.slides;
      });
      getHomeGoods("sales").then((res) => {
        goods.sales.list = res.goods.data;
      });
      getHomeGoods("recommend").then((res) => {
        goods.recommend.list = res.goods.data;
      });
      getHomeGoods("new").then((res) => {
        goods.new.list = res.goods.data;
      });
      //创建BetterScroll对象
      bscroll = new BetterScroll(document.querySelector(".wrapper"), {
        probeType: 3,
        click: true,
        pullUpLoad: true,
      });
      //触发滚动事件
      bscroll.on("scroll", (position) => {
        isFixed.value = -position.y > banref.value.offsetHeight;
      });
      //上拉加载数据。触发pullingUp事件
      bscroll.on("pullingUp", () => {
        const page = goods[currentType.value].page + 1;
        getHomeGoods(currentType.value, page).then((res) => {
          goods[currentType.value].list.push(...res.goods.data);
          goods[currentType.value].page += 1;
        });
        //完成上拉后，要将请求的数据展示出来
        bscroll.finishPullUp();
        bscroll.refresh();
      });
    });

    //通过点击把对应的types传给currentType
    const tabClick = (index) => {
      let types = ["sales", "new", "recommend"];
      currentType.value = types[index];
      nextTick(() => {
        bscroll && bscroll.refresh();
      });
    };

    watchEffect(() => {
      nextTick(() => {
        bscroll && bscroll.refresh();
      });
    });

    const bTop = () => {
      bscroll.scrollTo(0, 0, 500);
    };
    return {
      recommends,
      tabClick,
      goods,
      showGoods,
      isFixed,
      banref,
      bTop,
      banners,
    };
  },
  components: {
    HomeSwiper,
    NavBar,
    RecommendView,
    TabControl,
    BackTop,
    GoodsList,
  },
};
</script>

<style>
.banners img {
  width: 100%;
  height: auto;
}

#home {
  height: 100vh;
  position: relative;
}

.wrapper {
  position: absolute;
  top: 45px;
  bottom: 50px;
  left: 0px;
  right: 0px;
  overflow: hidden;
}
</style>