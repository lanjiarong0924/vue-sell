<template>
    <div class="shop-cart-sticky" v-show="visible">
        <shop-cart
        ref="shopCart"
        :selectFoods="selectFoods"
        :deliveryPrice="deliveryPrice"
        :minPrice="minPrice"
        :fold="fold"
        :sticky=true
        >

        </shop-cart>
    </div>
</template>

<script>
  import ShopCart from 'components/shop-cart/shop-cart'
 import popupMixin from 'common/mixins/popup'

  export default {
     name: 'shop-cart-sticky',
      mixins: [popupMixin],
      //把注释得这些代码 ，都是重复得放在了mixins 得popup上 
    // data(){
    //     return{
    //         visible:false
    //     }
    // },

    props: {
      selectFoods: {
        type: Array,
        default() {
          return []
        }
      },
      deliveryPrice:{
          type:Number,
          default:0
      },
      minPrice:{
          type:Number,
          default:0
      },
         fold:{
        type:Boolean,
        default:true
      },
         list: {
        type: Object,
        default() {
          return {}
        }
      }
    },

    methods: {
      //把注释得这些代码 ，都是重复得放在了mixins 得popup上    
      // show(){
      //     this.visible = true
      // },
      // hide(){
      //     this.visible = false
      // },
      drop(el){
        this.$refs.shopCart.drop(el)

      }
    },
    components: {
      ShopCart
    }
  }
</script>

<style lang="stylus" scoped>
  .shop-cart-sticky
    position: absolute
    left: 0
    bottom: 0
    z-index: 999
    width: 100%
    height: 48px
</style>
