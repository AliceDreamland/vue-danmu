<template>
  <div>
    <!--时间轴-->
    <div class="time-line">
      <div id="slider" ref="slider" class="player-bar" @click="ClickSlider">
        <div
          id="loaded"
          class="player-loaded"
          :style="`width: ${loaded}%`"
        ></div>
        <div id="played" class="player-played" :style="`width: ${played}%`">
          <div id="block" ref="block" class="player-block"></div>
        </div>
      </div>
    </div>
    <div class="control-box">
      <!--控制栏左-->
      <div class="control-left">
        <w-button type="text" @click="PlayOrPause()">
          <svg-icon class="control-icon" :icon="video.state"></svg-icon>
        </w-button>
        <span class="time-text">{{ video.nowTime }} /{{ video.durationText }}</span>
      </div>
      <!--控制栏中(全屏状态下的弹幕发送区)-->
      <div class="control-center"></div>
      <!--控制栏右-->
      <div class="control-right">
        <w-button class="res" type="text" @click="ShowMenu('res')">{{resText}}</w-button>
        <div class="res-menu" v-show="menu.res">
          <div v-if="$parent.original">
            <w-button type="text" @click="SetRes('original')">原始</w-button>
          </div>
          <div v-else>                    
            <w-button v-show="$parent.maxRes >= 1080" type="text" @click="SetRes(1080)">1080P</w-button>
            <w-button v-show="$parent.maxRes >= 720" type="text" @click="SetRes(720)">720P</w-button>
            <w-button v-show="$parent.maxRes >= 480" type="text" @click="SetRes(480)">480P</w-button>
            <w-button type="text" @click="SetRes('360')">360P</w-button>
          </div>
        </div>
        <w-button class="speed" type="text" @click="ShowMenu('speed')">{{speedText}}</w-button>
        <div class="speed-menu" v-show="menu.speed">
          <w-button type="text" @click="SetSpeed(0.5)">0.5x</w-button>
          <w-button type="text" @click="SetSpeed(0.75)">0.75x</w-button>
          <w-button type="text" @click="SetSpeed(1)">1.0x</w-button>
          <w-button type="text" @click="SetSpeed(1.25)">1.25x</w-button>
          <w-button type="text" @click="SetSpeed(1.5)">1.5x</w-button>
          <w-button type="text" @click="SetSpeed(2)">2.0x</w-button>
        </div>
        <!--音量-->
        <w-button class="right-icon" type="text" @click="ShowMenu('volume')">
          <svg-icon class="control-icon" icon="volume"></svg-icon>
        </w-button>
        <div class="volume" v-show="menu.volume">
          <v-slider class="slider" :height="120" direction="btt" v-model="video.volume" @change="SetVolume()"/>
        </div>
        <w-button class="right-icon" type="text" @click="FullScreen()">
          <svg-icon class="control-icon" icon="fullScreen"></svg-icon>
        </w-button>
      </div>
    </div>
  </div>
</template>

<script>
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/default.css";
import svgIcon from "../components/svg-icon.vue";
import wButton from "../components/w-button.vue";
export default {
  props: {},
  data() {
    return {
      //基本信息变量
      video: {
        play: false, //播放还是暂停 true播放中
        state: "play",
        nowTime: "00:00",
        duration: 0, //时长
        durationText: 0, //时长文本
        speed: "倍速", //视频倍速
        volume: 80, //音量
      },
      menu: {
        speed: false,
        volume: false,
        res: false,
      },
      played: 0,
      loaded: 0,
      block: null, //拖拽DOM元素
      slider: null, //滚动条DOM元素
      isFull: false, //是否全屏
      speedText: "倍速",//倍速文本
    };
  },
  methods: {
    Init(duration) {
      this.video.duration = duration;
      this.video.durationText = this.VideoTime(duration);
    },
    PlayOrPause() {
      let video = this.$parent.$refs.video;
      if (this.video.play) {
        //播放中改为暂停
        video.pause();
        this.video.state = "play";
        this.$parent.PauseDanmaku();
      } else if (this.video.state == "replay") {
        video.play();
        this.video.state = "pause";
        this.$parent.StartDanmaku();
      } else {
        video.play();
        this.video.state = "pause";
        this.$parent.StartDanmaku();
      }
      this.video.play = !this.video.play;
    },
    TimeUpdate(currTime, loaded) {
      this.video.nowTime = this.VideoTime(currTime);
      this.played = Math.round((currTime / this.video.duration) * 10000) / 100;
      this.loaded = Math.round((loaded / this.video.duration) * 10000) / 100;
    },
    VideoEnd() {
      this.video.state = "replay";
      this.$parent.PauseDanmaku();
    },
    ChangeSlider(width) {
      let currTime = this.video.duration * (width / 100);
      this.$parent.ChangeVideoProgress(currTime);
      this.$parent.ClearDanmaku();
    },
    //显示菜单
    ShowMenu(name) {
      //关闭除了name以外所有的菜单
      for (let key in this.menu) {
        if(key == name){
          this.menu[key] = !this.menu[key];
          continue;
        }
        this.menu[key] = false;
      }
    },
    //点击滑动条
    ClickSlider(e) {
      let id = e.target.id;
      if (id == "slider" || id == "loaded" || id == "played") {
        if(this.video.state == "replay"){
          this.video.state = "play";
        }
        let slider = this.$refs.slider;
        let target = (e.offsetX / slider.clientWidth) * this.video.duration;
        this.$parent.ChangeVideoProgress(target);
        this.$parent.ClearDanmaku();
      }
    },
    //设置倍速
    SetSpeed(speed) {
      this.$parent.$refs.video.playbackRate = speed;
      if (speed != 1) {
        this.speedText = speed + "x";
      } else {
        this.speedText = "倍速";
      }
      this.menu.speed = false;
    },
    //设置分辨率
    SetRes(res) {
      this.$parent.SetRes(res);
    },
    //设置音量
    SetVolume() {
      this.$parent.$refs.video.volume = this.video.volume / 100;
      this.$parent.playerConfig = { key: "volume", value: this.video.volume };
    },
    // 判断是否为全屏
    IsFullScreen() {
      return !!(
        document.fullscreen ||
        document.mozFullScreen ||
        document.webkitIsFullScreen ||
        document.webkitFullScreen ||
        document.msFullScreen
      );
    },
    //全屏
    FullScreen() {
      if (!this.isFull) {
        var doc = this.$parent.$refs.videoBox;
        if (doc.requestFullscreen) {
          doc.requestFullscreen();
        } else if (doc.mozRequestFullScreen) {
          doc.mozRequestFullScreen();
        } else if (doc.webkitRequestFullScreen) {
          doc.webkitRequestFullScreen();
        }
        this.isFull = true;
      } else {
        if (this.IsFullScreen()) {
          let exit = document;
          if (exit.exitFullscreen) {
            exit.exitFullscreen();
          } else if (exit.mozCancelFullScreen) {
            exit.mozCancelFullScreen();
          } else if (exit.webkitCancelFullScreen) {
            exit.webkitCancelFullScreen();
          }
        }
        this.isFull = false;
      }
    },
    //快进或快退
    //参数 方向dir(true前进，false后退)
    //参数 时间n
    FastForwardOrRewind(dir,n){
      let dur = this.video.duration;
      let current = this.$parent.$refs.video.currentTime;
      if(dir){
        this.$parent.ChangeVideoProgress(current+n > dur?dur:current+n);
      }else{
        this.$parent.ChangeVideoProgress(current-n < 0?0:current-n);
      }
    },
    //处理时间格式
    VideoTime(time) {
      var m = parseInt(time / 60);
      var s = parseInt(time % 60);
      m = m < 10 ? "0" + m : m;
      s = s < 10 ? "0" + s : s;
      return m + ":" + s;
    },
  },
  mounted() {
    let that = this;
    this.block = this.$refs.block;
    this.slider = this.$refs.slider;
    this.block.onmousedown = function () {
      let width = that.slider.offsetWidth;
      document.onmousemove = function (e) {
        //计算新的百分比
        let newWidth = Math.round(((e.clientX - that.left) / width) * 10000) / 100;
        newWidth = Math.max(0, newWidth);
        newWidth = Math.min(newWidth, 100);
        that.played = newWidth;
        //更新视频进度
        that.ChangeSlider(newWidth);
      };
      document.onmouseup = function () {
        document.onmousemove = document.onmouseup = null;
      };
    };
  },
  computed:{
    left(){
      return this.$parent.$refs.videoOuterLayer.offsetLeft;
    },
    resText() {
      if (this.$parent.original) return '原始';
      return this.$parent.currentRes+ 'P';
    }
  },
  components: {
    "svg-icon": svgIcon,
    "w-button": wButton,
    "v-slider": VueSlider,
  },
  created(){
    this.video.volume = this.$parent.playerConfig.volume;
  }
};
</script>

<style scoped>
.time-line {
  margin-left: 6px;
  width: calc(100% - 12px);
}

.player-bar {
  position: relative;
  width: 100%;
  background: rgba(107, 107, 107, 0.6);;
  height: 4px;
  cursor: pointer;
}

.player-loaded {
  position: absolute;
  background: #fff;
  height: 4px;
}

.player-played {
  position: absolute;
  background: #1890ff;
  height: 4px;
}

.player-block {
  position: absolute;
  top: -4px;
  right: -6px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid #409eff;
  background: #fff;
  transition: 0.2s all;
  user-select: none;
}

/**控制按键 */
.control-box {
  display: flex;
}

.control-left {
  width: 200px;
  display: flex;
}

.control-center {
  width: calc(100% - 370px);
}

.control-right {
  display: flex;
  justify-content: space-between;
  width: 230px;
}

.control-icon {
  width: 30px;
  height: 30px;
  margin-top: 8px;
}

.time-text {
  color: #fff;
  margin-top: 14px;
}

.speed {
  padding: 0 10px;
  margin-top: 8px;
}

.speed-menu {
  width: 60px;
  bottom: 56px;
  right: 116px;
  position: absolute;
  text-align: center;
  border-color: transparent;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.5);
}

.res {
  padding: 0 10px;
  margin-top: 8px;
}

.res-menu {
  width: 60px;
  bottom: 56px;
  right: 156px;
  position: absolute;
  text-align: center;
  border-color: transparent;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.5);
}

.right-icon {
  padding: 0 10px;
}

.volume{
  width: 32px;
  height: 140px;
  right: 70px;
  bottom: 56px;
  border-radius: 5px;
  position: absolute;
  background: rgba(0, 0, 0, 0.7);
}

.slider{
  top: 12px;
  left: 8px;
}
</style>