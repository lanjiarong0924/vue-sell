<template>
  <div class="tab">
    <cube-tab-bar
      :useTransition="false"
      :showSlider="true"
      v-model="selectedLabel"
      :data="tabs"
      ref="tabBar"
      class="border-bottom-1px"
    ></cube-tab-bar>
    <div class="slide-wrapper">
      <cube-slide
        :loop="false"
        :auto-play="false"
        :show-dots="false"
        :initial-index="index"
        ref="slide"
        @change="onChange"
        @scroll="onScroll"
        :options="slideOptions"
      >
        <cube-slide-item v-for="(tab, index) in tabs" :key="index">
          <component :is="tab.component" :data="tab.data" ref="component"></component>
        </cube-slide-item>
      </cube-slide>
    </div>
  </div>
</template>

<script>
export default {
  name: "tab",
  props: {
    tabs: {
      type: Array,
      default() {
        return [];
      }
    },
    initialIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      index: this.initialIndex,
      slideOptions: {
        listenScroll: true,
        probeType: 3,
        directionLockThreshold: 0
      }
    };
  },
  computed: {
    selectedLabel: {
      get() {
        return this.tabs[this.index].label;
      },
      set(newVal) {
        this.index = this.tabs.findIndex(value => {
          return value.label === newVal;
        });
      }
    }
  },
  mounted() {
    //加一个mounted方法 默认当前第一个是 goods得
    this.onChange(this.index);   
  },
  methods: {
    onChange(current) {
      this.index = current;
      const component = this.$refs.component[current]; //component再列表上 是一个数组 给她一个current 就获取到当前组件
      component.fetch && component.fetch(); //给她一个判断，如果定义了这个方法  就让他去调用
    },
    onScroll(pos) {
      const tabBarWidth = this.$refs.tabBar.$el.clientWidth; //因为是一个组件，所以他的dom是一个$element然后拿到他的宽度clientWidth
      const slideWidth = this.$refs.slide.slide.scrollerWidth; //slide内部有一个slide对象，这个对象呢实际上是一个实例，有一个scrollerWidth
      const tranform = (-pos.x / slideWidth) * tabBarWidth; //接下来算一个比例 pos是一个负值 所以加个 - 变成正 pos.x就是slide得滚动位置/slideWidth 算出一个比例 再×就能算出滚动得位置
      this.$refs.tabBar.setSliderTransform(tranform);
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';

.tab {
  display: flex;
  flex-direction: column;
  height: 100%;

  >>> .cube-tab {
    padding: 10px 0;
  }

  .slide-wrapper {
    flex: 1;
    overflow: hidden;
  }
}
</style>
