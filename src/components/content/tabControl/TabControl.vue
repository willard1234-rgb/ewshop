<template>
  <div class="tab-control">
    <div
      v-for="(item, index) in titles"
      :key="index"
      @click="itemClick(index)"
      class="tab-control-item"
      :class="{ active: index == currentIndex }"
    >
      <span>{{ item }}</span>
    </div>
    <!-- <div class="tab-control-item active">
      <span>新书</span>
    </div>
    <div class="tab-control-item">
      <span>精选</span> -->
    <!-- </div> -->
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  name: "TabControl",
  props: {
    titles: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  setup(props, { emit }) {
    let currentIndex = ref(0);
    const itemClick = (index) => {
      currentIndex.value = index;
      emit("tabClick", index);
    };

    return {
      currentIndex,
      itemClick,
    };
  },
};
</script>

<style lang="scss">
.tab-control {
  display: flex;
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 14px;
  background-color: #fff;
  width: 100%;
  position: sticky;
  top: 44px;
  z-index: 10;
  .tab-control-item {
    flex: 1;
    span {
      padding: 6px;
    }
  }
  .active {
    color: var(--color-tint);
    span {
      border-bottom: 2px solid var(--color-tint);
    }
  }
}
</style>