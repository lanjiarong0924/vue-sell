<template>
  <div>
    <div class="shopcart">
      <div class="content" @click="toggleList">
        <div class="content-left">
          <div class="logo-wrapper">
            <div class="logo" :class="{'highlight':totalCount>0}">
              <i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
            </div>
            <div class="num" v-show="totalCount>0">
              <bubble :num="totalCount"></bubble>
            </div>
          </div>
          <div class="price" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}</div>
          <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
        </div>
        <div class="content-right">
          <div @click.stop="pay" class="pay" :class="payClass">{{payDesc}}</div>
        </div>
      </div>
      <div class="ball-container">
        <div v-for="(ball, index) in balls" :key="index">
          <transition @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
            <div class="ball" v-show="ball.show">
              <div class="inner inner-hook"></div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Bubble from "components/bubble/bubble";

const BALL_LEN = 10;
const innerClsHook = "inner-hook";
function createBalls() {
  let ret = [];
  for (let i = 0; i < BALL_LEN; i++) {
    ret.push({
      show: false
    });
  }
  return ret;
}
export default {
  name: "shop-cart",
  props: {
    selectFoods: {
      type: Array,
      default() {
        return [];
      }
    },
    deliveryPrice: {
      type: Number,
      default: 0
    },
    minPrice: {
      type: Number,
      default: 0
    },
    fold: {
      type: Boolean,
      default: true
    },
    sticky: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      balls: createBalls(),
      listFold: this.fold
    };
  },
  computed: {
    totalPrice() {
      let total = 0;
      this.selectFoods.forEach(food => {
        total += food.price * food.count;
      });
      return total;
    },
    totalCount() {
      let count = 0;
      this.selectFoods.forEach(food => {
        count += food.count;
      });
      return count;
    },
    payDesc() {
      if (this.totalPrice === 0) {
        return `￥${this.minPrice}元起送`;
      } else if (this.totalPrice < this.minPrice) {
        let diff = this.minPrice - this.totalPrice;
        return `还差￥${diff}元起送`;
      } else {
        return "去结算";
      }
    },
    payClass() {
      if (!this.totalCount || this.totalPrice < this.minPrice) {
        return "not-enough";
      } else {
        return "enough";
      }
    }
  },
  created() {
    //加一个生命周期钩子
    this.dropBalls = []; //这是下落得小球  然后把下面隐藏小球放到这里来

  },
  methods: {
    drop(el) {
      for (let i = 0; i < this.balls.length; i++) {
        const ball = this.balls[i]; //找到第一个小球
        if (!ball.show) {
          ball.show = true;
          ball.el = el;
          this.dropBalls.push(ball); //放在下落小球里面
          return;
        }
      }
    },
    beforeDrop(el) {
      const ball = this.dropBalls[this.dropBalls.length - 1];
      const rect = ball.el.getBoundingClientRect(); //拿到他的物理信息
      const x = rect.left - 32; //落到正中心离左边就是32PX  最后X就等于正中心位置
      const y = -(window.innerHeight - rect.top - 22); //加号得位置离顶部得top  终点位置离底部22距离  负值
      el.style.display = ""; //先把el显示出来
      el.style.transform = el.style.webkitTransform = `translate3d(0,${y}px,0)`;
      const inner = el.getElementsByClassName(innerClsHook)[0];
      inner.style.transform = inner.style.webkitTransform = `translate3d(${x}px,0,0)`; //兼荣
    },
    dropping(el, done) {
      this._reflow = document.body.offsetHeight;
      el.style.transform = el.style.webkitTransform = `translate3d(0,0,0)`;
      const inner = el.getElementsByClassName(innerClsHook)[0];
      inner.style.transform = inner.style.webkitTransform = `translate3d(0,0,0)`;
      el.addEventListener("transitionend", done); //告诉这个组件 我这个动画结束了  然后执行下面那个钩子函数
    },
    afterDrop(el) {
      const ball = this.dropBalls.shift(); //先拿这个ball 最先得
      if (ball) {
        ball.show = false; //把她回来起来隐藏了
        el.style.display = "none";
      }
    },
    toggleList() {
      if (this.listFold) {
        //收起来之前要有个判断
        if (!this.totalCount) {
          //如果{totalCount没用得话 为0得话  什么都不做 返回一个retuen
          return;
        }
        this.listFold = false;
        this._showShopCartList();
        this._showShopCartSticky();
      } else {
        this.listFold = true; //不然得话就让她收起
        this._hideShopCartList();
      }
    },
    pay(e){
      if(this.totalPrice<this.minPrice){   //当小于最低起送价时不能点结算
        return
      }
      this.dialogComp =this.$createDialog({
        title:  '支付',
        content:`支付${this.totalPrice}元`
      })
      this.dialogComp.show()
      e.stopPropagation()  //阻止默认事件
    },
    _showShopCartList() {
      this.shopCartListComp =
        this.shopCartListComp ||
        this.$createShopCartList({
          $props: {
            selectFoods: "selectFoods"
          },
          $events: {
            hide: () => {
              this.listFold = true;
            },
            leave: () => {
              this._hideShopCartSticky();
            },
            add: (el) => {
              this.shopCartStickyComp.drop(el)
            }
          }
        });
      this.shopCartListComp.show();
    },
    _showShopCartSticky() {
      this.shopCartStickyComp =
        this.shopCartStickyComp ||
        this.$createShopCartSticky({
          $props: {
            selectFoods: "selectFoods",
            deliveryPrice: "deliveryPrice",
            minPrice: "minPrice",
            fold: "listFold",
            list: this.shopCartListComp
          }
        });
      this.shopCartStickyComp.show();
    },
    _hideShopCartList() {
      const comp = this.sticky ? this.$parent.list : this.shopCartListComp;
      comp.hide && comp.hide();
    },
    _hideShopCartSticky() {
      this.shopCartStickyComp.hide();
    }
  },
  watch: {
    fold(newVal) {
      //每次获得到新值得时候，就去给她赋值
      this.listFold = newVal;
    },
    totalCount(newVal){
      if(!this.listFold && !newVal) {
        this._hideShopCartList()
      }
    }
  },
  components: {
    Bubble
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/mixin';
@import '~common/stylus/variable';

.shopcart {
  height: 100%;

  .content {
    display: flex;
    background: $color-background;
    font-size: 0;
    color: $color-light-grey;

    .content-left {
      flex: 1;

      .logo-wrapper {
        display: inline-block;
        vertical-align: top;
        position: relative;
        top: -10px;
        margin: 0 12px;
        padding: 6px;
        width: 56px;
        height: 56px;
        box-sizing: border-box;
        border-radius: 50%;
        background: $color-background;

        .logo {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          text-align: center;
          background: $color-dark-grey;

          &.highlight {
            background: $color-blue;
          }

          .icon-shopping_cart {
            line-height: 44px;
            font-size: $fontsize-large-xxx;
            color: $color-light-grey;

            &.highlight {
              color: $color-white;
            }
          }
        }

        .num {
          position: absolute;
          top: 0;
          right: 0;
        }
      }

      .price {
        display: inline-block;
        vertical-align: top;
        margin-top: 12px;
        line-height: 24px;
        padding-right: 12px;
        box-sizing: border-box;
        border-right: 1px solid rgba(255, 255, 255, 0.1);
        font-weight: 700;
        font-size: $fontsize-large;

        &.highlight {
          color: $color-white;
        }
      }

      .desc {
        display: inline-block;
        vertical-align: top;
        margin: 12px 0 0 12px;
        line-height: 24px;
        font-size: $fontsize-small-s;
      }
    }

    .content-right {
      flex: 0 0 105px;
      width: 105px;

      .pay {
        height: 48px;
        line-height: 48px;
        text-align: center;
        font-weight: 700;
        font-size: $fontsize-small;

        &.not-enough {
          background: $color-dark-grey;
        }

        &.enough {
          background: $color-green;
          color: $color-white;
        }
      }
    }
  }

  .ball-container {
    .ball {
      position: fixed;
      left: 32px;
      bottom: 22px;
      z-index: 200;
      transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41);

      .inner {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: $color-blue;
        transition: all 0.4s linear;
      }
    }
  }
}
</style>
