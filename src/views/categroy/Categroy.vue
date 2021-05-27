<template>
  <div>
    <nav-bar>
      <template v-slot:default>商品分类</template>
    </nav-bar>
    <div id="mainbox">
      <div class="ordertab">
        <van-tabs v-model="active" @click="tabClick">
          <van-tab title="销量排序"></van-tab>
          <van-tab title="价格排序"></van-tab>
          <van-tab title="评价排序"></van-tab>
        </van-tabs>
      </div>

      <van-sidebar class="leftmenu" v-model="activeKey">
        <van-collapse v-model="activeName" accordion>
          <van-collapse-item
            v-for="item in categroies.slice(0, 5)"
            :key="item.id"
            :title="item.name"
            :name="item.name"
          >
            <van-sidebar-item
              v-for="sub in item.children"
              :title="sub.name"
              :key="sub.id"
              @click="getGoods(sub.id)"
            />
          </van-collapse-item>
        </van-collapse>
      </van-sidebar>

      <div class="goodlist">
        <div class="content">
          <van-card
            v-for="item in showGoods"
            :key="item.id"
            @click="itemClick(item.id)"
            num="10"
            :tag="item.comments_count >= 0 ? '流行' : '标签'"
            :price="item.price"
            :desc="item.updated_at"
            :title="item.title"
            :thumb="item.cover_url"
            :lazy-load="true"
          />
        </div>
      </div>
    </div>
    <back-top @bTop="bTop" v-show="isFixed"></back-top>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
import { getCategroy, getCategroyGoods } from "network/categroy";
import { ref, onMounted, reactive, computed, watchEffect, nextTick } from "vue";
import { useRouter } from "vue-router";
import BetterScroll from "better-scroll";
import BackTop from "components/common/backtop/BackTop";
export default {
  name: "Categroy",
  setup() {
    const router = useRouter();
    let isFixed = ref(false);
    let activeKey = ref(0);
    let activeName = ref(1);
    let categroies = ref([]);
    let active = ref(1);
    //当前的排序条件
    let currentOrder = ref("sales"); //默认销量排序
    //当前的分类id
    let currentCid = ref(0);
    //数据模型
    const goods = reactive({
      sales: { page: 1, list: [] },
      price: { page: 1, list: [] },
      comments_count: { page: 1, list: [] },
    });

    const showGoods = computed(() => {
      return goods[currentOrder.value].list;
    });

    const init = () => {
      getCategroyGoods("sales", currentCid.value).then((res) => {
        goods.sales.list = res.goods.data;
      });
      getCategroyGoods("price", currentCid.value).then((res) => {
        goods.price.list = res.goods.data;
      });
      getCategroyGoods("comments_count", currentCid.value).then((res) => {
        goods.comments_count.list = res.goods.data;
      });
    };
    let bscroll = reactive({});
    onMounted(() => {
      getCategroy().then((res) => {
        categroies.value = res.categories;
      });
      getCategroyGoods("sales", currentCid.value).then((res) => {
        goods.sales.list = res.goods.data;
      });
      //创建BetterScroll对象
      bscroll = new BetterScroll(document.querySelector(".goodlist"), {
        probeType: 3,
        click: true,
        pullUpLoad: true,
      });
      //触发滚动事件
      bscroll.on("scroll", (position) => {
        isFixed.value = -position.y > 300;
      });
      //上拉加载数据。触发pullingUp事件
      bscroll.on("pullingUp", () => {
        const page = goods[currentOrder.value].page + 1;
        getCategroyGoods(currentOrder.value, currentCid.value).then((res) => {
          goods[currentOrder.value].list.push(...res.goods.data);
          goods[currentOrder.value].page += 1;
        });
        //完成上拉后，要将请求的数据展示出来
        bscroll.finishPullUp();
        bscroll.refresh();
        console.log(page);
      });
    });

    //排序选项卡
    const tabClick = (index) => {
      let orders = ["sales", "price", "comments_count"];
      currentOrder.value = orders[index];
      getCategroyGoods(currentOrder.value, currentCid.value).then((res) => {
        goods[currentOrder.value].list = res.goods.data;
        nextTick(() => {
          bscroll && bscroll.refresh();
        });
      });
    };

    //通过分类得到商品
    const getGoods = (cid) => {
      currentCid.value = cid;
      init();
    };

    watchEffect(() => {
      nextTick(() => {
        bscroll && bscroll.refresh();
      });
    });
    const bTop = () => {
      bscroll.scrollTo(0, 0, 300);
    };
    return {
      activeKey,
      categroies,
      activeName,
      active,
      tabClick,
      currentOrder,
      currentCid,
      getGoods,
      goods,
      showGoods,
      init,
      bscroll,
      isFixed,
      bTop,
      itemClick: (id) => {
        router.push({ path: "/detail", query: { id } });
      },
    };
  },
  components: {
    NavBar,
    BackTop,
  },
};
</script>

<style lang="scss">
#mainbox {
  margin-top: 45px;
  display: flex;
  .ordertab {
    height: 45px;
    position: fixed;
    top: 45px;
    right: 0;
    left: 130px;
  }
  .leftmenu {
    position: fixed;
    top: 95px;
    left: 0;
    width: 130px;
  }
  .goodlist {
    flex: 1;
    position: absolute;
    top: 100px;
    left: 130px;
    right: 0;
    height: 100vh;
    padding: 10px;
  }
}
</style>