<template>
  <div class="bottom-bar">
    <span class="danmaku-amount">{{$parent.amount}}条弹幕</span>
    <div class="danmaku-switch">
      <w-switch :value="danmaku" @change="ShowDanmaku"></w-switch>
    </div>
    <!--弹幕设置-->
    <div v-show="menu" class="danmaku-menu">
      <div class="danmaku-menu-top">
        <p class="danmaku-menu-title">弹幕颜色</p>
        <div class="customize-color">
          <span style="color: #fff">#</span>
          <input type="text" v-model="danForm.color" maxlength="6">
          <div :style="`background-color: #${danForm.color}`"></div>
        </div>
      </div>
      <div class="color-btn">
        <div @click="SetColor('fff')"></div>
        <div @click="SetColor('e54256')"></div>
        <div @click="SetColor('ffe133')"></div>
        <div @click="SetColor('64dd17')"></div>
        <div @click="SetColor('39ccff')"></div>
        <div @click="SetColor('d500f9')"></div>
      </div>
      <p class="danmaku-menu-title">弹幕类型</p>
      <div class="danmaku-type">
        <ul class="type-switch">
          <li class="type-item" :class="{'active':danForm.type === 0}" @click="SetType(0)">滚动</li>
          <li class="type-item" :class="{'active':danForm.type === 1}" @click="SetType(1)">顶部</li>
          <li class="type-item" :class="{'active':danForm.type === 2}" @click="SetType(2)">底部</li>
        </ul>
      </div>
      <p class="danmaku-menu-title">弹幕不透明度</p>
      <v-slider class="opacity" v-model="opacity" :max="100" @change="SetOpaque()"/>
    </div>
    <div class="danmaku-setting" @click="menu = !menu">
      <svg-icon class="danmaku-setting-icon" icon="setting"></svg-icon>
    </div>  
    <input ref="send" class="input" v-model="danForm.text" placeholder="发个友善的弹幕见证当下"/>
    <w-button :disabled="!danmaku" class="send-btn" @click="Send()">发送</w-button>
  </div>
</template>

<script>
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/default.css";
import WSwitch from "../components/w-switch.vue";
import svgIcon from "../components/svg-icon.vue";
import WButton from "../components/w-button.vue";
export default {
  data(){
    return{
      danForm:{
        text:"",
        color:"fff",
        type:0,
      },
      menu:false,
      opacity:100,
      danmaku:true,
    }
  },
  methods:{
    SetType(type){
      this.danForm.type = type;
    },
    //设置弹幕颜色
    SetColor(color) {
      this.danForm.color = color;
      this.$refs.send.style.color = color;
    },
    //设置弹幕不透明度
    SetOpaque(){
      this.$parent.SetOpaque(this.opacity);
    },
    //开启或关闭弹幕
    ShowDanmaku(val){
      this.danmaku = val;
      this.$parent.ShowDanmaku(val);
      this.$parent.playerConfig = { key: "danmaku", value: val };
    },
    //发送弹幕
    Send(){
      if(this.danForm.text == ""){
        this.$parent.ShowMessage("弹幕内容不能为空");
        return;
      }
      //验证颜色
      let reg = new RegExp("^([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$");
      if (this.danForm.color.match(reg) == null){
        return;
      }
      this.$parent.Send(this.danForm);
      this.danForm.text = "";
    }
  },
  components: {
    "w-switch": WSwitch,
    "svg-icon": svgIcon,
    "w-button": WButton,
    "v-slider": VueSlider,
  },
  created(){
    this.ShowDanmaku(this.$parent.playerConfig.danmaku);
  }
};
</script>

<style scoped>
.bottom-bar {
  position: relative;
  background: #fff;
  display: flex;
  width: 100%;
  height: 40px;
  align-items: center;
  border-bottom: 1px solid #ebebeb;
}

.danmaku-amount {
  padding-left: 12px;
  text-align: left;
  font-size: 12px;
  color: #999999;
  line-height: 40px;
  width: 120px;
}

.danmaku-switch {
  width: 46px;
}

.danmaku-setting{
  width: 30px;
  height: 30px;
  margin: 0 16px;
  cursor: pointer;
}

.danmaku-setting-icon {
  width: 30px;
  height: 30px;
}

.input {
  height: 26px;
  width: calc(100% - 200px);
  border: 0;
  outline: none;
  padding: 0 2px;
  border-radius: 6px;
  background: #ebebeb;
}

.send-btn {
  width: 72px;
  height: 26px;
  margin-left: 10px;
}

.danmaku-menu {
  position: absolute;
  z-index: 20;
  bottom: 40px;
  background: rgba(12, 12, 12, 0.8);
  width: 240px;
  height: 240px;
}

.danmaku-menu-top {
  display: flex;
  height: 46px;
  align-items: center;
  justify-content: space-between;
}

.danmaku-menu-title {
  color: #fff;
  margin: 12px 0 12px 10px;
}

.customize-color {
  display: flex;
  align-items: center;
}

.customize-color > input{
  width: 80px;
  height: 24px;
  margin: 0 8px 0 2px;
  background-color: transparent;
  color: #fff;
  border: 1px solid rgba(161, 161, 161, 0.2);
}

.customize-color > input:focus {
  border: 1px solid rgba(161, 161, 161, 0.2);
}

.customize-color > div{
  width: 26px;
  height: 26px;
  border-radius: 50%;
  margin-right: 8px;
}

.color-btn {
  display: flex;
  flex-wrap: nowrap;
}

.color-btn>div {
  width: 30px;
  height: 30px;
  margin: 0 0 5px 8px;
  border-radius: 50%;
  cursor: pointer;
}

.color-btn>div:nth-child(1) {
  background-color: white;
}

.color-btn>div:nth-child(2) {
  background-color: #e54256;
}

.color-btn>div:nth-child(3) {
  background-color: #ffe133;
}

.color-btn>div:nth-child(4) {
  background-color: #64dd17;
}

.color-btn>div:nth-child(5) {
  background-color: #39ccff;
}

.color-btn>div:nth-child(6) {
  background-color: #d500f9;
}

/**切换弹幕类型 */
.danmaku-type{
  margin-left: 16px;
}

.type-switch{
  padding: 0;
  margin: 0;
  display: flex;
  list-style: none;
  width: 200px;
  border: 1px solid #fff;
  border-radius: 6px;
  overflow: hidden;
}

.type-item{
  flex: 1;
  color: #fff;
  padding: 10px;
  text-align: center;
  padding: 6px 6px;
}

.active{
  transition: all .3s;
  background-color: #1890ff;
}

.opacity{
  width: 90%!important; 
  margin: 0 auto;
}
</style>