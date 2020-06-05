<template>
  <div>
    <head-top></head-top>
    <header class="admin_title">聊天機器人</header>

    <div v-show="show">
      <iframe :src="srcM + adminInfo.user_name" :style="fixStyle"></iframe>
    </div>
  </div>
</template>

<script>
import PATH_TO_BG_IMG_1 from "@/assets/img/aia_logo1.png";
import headTop from "@/components/headTop";
import { mapActions, mapState } from "vuex";
import {
  cityGuess,
  addShop,
  getToken,
  searchplace,
  foodCategory
} from "@/api/getData";
import { baseUrl, baseImgPath } from "@/config/env";

export default {
  data() {
    return {
      PATH_TO_BG_IMG_1,
      fixStyle: "",
      show: true,
      src:
        "https://portal-mc.insuremo.com/custom-ai-web/#/cloudim/client/19e095921f8a81d866702ea34b0af884",
      srcM:
        "https://dev.ebaocloud.com/custom-ai-web/#/cloudim/client/2986f174ecfbbf2738d1f2c16ef599cb?lang=en-US&username="
    };
  },
  computed: {
    ...mapState(["adminInfo"])
  },
  components: {
    headTop
  },
  mounted() {
    window.onresize = () => {
      const windowWidth = document.body.clientWidth;
      const windowHeight = document.body.clientHeight;
      this.fixStyle = {
        height: windowHeight - 130 + "px",
        width: windowWidth - 245 + "px"
      };
    };
    window.onresize();
  },
  methods: {
    submitForm(formName) {}
  }
};
</script>

<style lang="less">
@import "../style/mixin";
.admin_title {
  margin-top: 20px;
  .sc(24px, #666);
  text-align: center;
}
</style>
