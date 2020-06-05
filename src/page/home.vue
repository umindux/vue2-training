<template>
  <div>
    <head-top></head-top>
    <section class="data_section">
      <header class="section_title">数据统计</header>
      <el-row :gutter="20" style="margin-bottom: 10px;">
        <el-col :span="4"
          ><div class="data_list today_head">
            <span class="data_num head">当日数据：</span>
          </div></el-col
        >
        <el-col :span="4"
          ><div class="data_list">
            <span class="data_num">{{ userCount }}</span> 新增用户
          </div></el-col
        >
        <el-col :span="4"
          ><div class="data_list">
            <span class="data_num">{{ orderCount }}</span> 新增订单
          </div></el-col
        >
        <el-col :span="4"
          ><div class="data_list">
            <span class="data_num">{{ adminCount }}</span> 新增管理员
          </div></el-col
        >
      </el-row>
      <el-row :gutter="20">
        <el-col :span="4"
          ><div class="data_list all_head">
            <span class="data_num head">总数据：</span>
          </div></el-col
        >
        <el-col :span="4"
          ><div class="data_list">
            <span class="data_num">{{ allUserCount }}</span> 注册用户
          </div></el-col
        >
        <el-col :span="4"
          ><div class="data_list">
            <span class="data_num">{{ allOrderCount }}</span> 订单
          </div></el-col
        >
        <el-col :span="4"
          ><div class="data_list">
            <span class="data_num">{{ allAdminCount }}</span> 管理员
          </div></el-col
        >
      </el-row>
    </section>
    <tendency :sevenDate="sevenDate" :sevenDay="sevenDay"></tendency>

    <div class="chatContainer">
      <div class="chatBtn" @click="search">
        <img :src="PATH_TO_BG_IMG_1" alt="" />
      </div>
      <div v-show="show" class="chatBox" ref="chatBox">
        <iframe
          :src="srcM + adminInfo.user_name"
          width="530px"
          height="570px"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script>
import PATH_TO_BG_IMG_1 from "@/assets/img/aia_logo1.png";
import headTop from "../components/headTop";
import tendency from "../components/tendency";
import dtime from "time-formater";
import { mapActions, mapState } from "vuex";
import "@/page/chat.css";

import {
  userCount,
  orderCount,
  getUserCount,
  getOrderCount,
  adminDayCount,
  adminCount
} from "@/api/getData";
export default {
  data() {
    return {
      PATH_TO_BG_IMG_1,
      show: false,
      src:
        "https://portal-mc.insuremo.com/custom-ai-web/#/cloudim/client/19e095921f8a81d866702ea34b0af884",
      srcM:
        "https://dev.ebaocloud.com/custom-ai-web/#/cloudim/client/2986f174ecfbbf2738d1f2c16ef599cb?lang=en-US&username=",
      userCount: null,
      orderCount: null,
      adminCount: null,
      allUserCount: null,
      allOrderCount: null,
      allAdminCount: null,
      sevenDay: [],
      sevenDate: [[], [], []]
    };
  },
  components: {
    headTop,
    tendency
  },
  mounted() {
    this.initData();
    for (let i = 6; i > -1; i--) {
      const date = dtime(new Date().getTime() - 86400000 * i).format(
        "YYYY-MM-DD"
      );
      this.sevenDay.push(date);
    }
    this.getSevenData();
  },
  computed: {
    ...mapState(["adminInfo"])
  },
  methods: {
    search() {
      if (this.show) {
        this.show = false;
      } else {
        this.show = true;
      }
    },
    async initData() {
      const today = dtime().format("YYYY-MM-DD");
      Promise.all([
        userCount(today),
        orderCount(today),
        adminDayCount(today),
        getUserCount(),
        getOrderCount(),
        adminCount()
      ])
        .then(res => {
          this.userCount = res[0].count;
          this.orderCount = res[1].count;
          this.adminCount = res[2].count;
          this.allUserCount = res[3].count;
          this.allOrderCount = res[4].count;
          this.allAdminCount = res[5].count;
        })
        .catch(err => {
          console.log(err);
        });
    },
    async getSevenData() {
      const apiArr = [[], [], []];
      this.sevenDay.forEach(item => {
        apiArr[0].push(userCount(item));
        apiArr[1].push(orderCount(item));
        apiArr[2].push(adminDayCount(item));
      });
      const promiseArr = [...apiArr[0], ...apiArr[1], ...apiArr[2]];
      Promise.all(promiseArr)
        .then(res => {
          const resArr = [[], [], []];
          res.forEach((item, index) => {
            if (item.status == 1) {
              resArr[Math.floor(index / 7)].push(item.count);
            }
          });
          this.sevenDate = resArr;
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="less">
@import "../style/mixin";
.data_section {
  padding: 20px;
  margin-bottom: 40px;
  .section_title {
    text-align: center;
    font-size: 30px;
    margin-bottom: 10px;
  }
  .data_list {
    text-align: center;
    font-size: 14px;
    color: #666;
    border-radius: 6px;
    background: #e5e9f2;
    .data_num {
      color: #333;
      font-size: 26px;
    }
    .head {
      border-radius: 6px;
      font-size: 22px;
      padding: 4px 0;
      color: #fff;
      display: inline-block;
    }
  }
  .today_head {
    background: #ff9800;
  }
  .all_head {
    background: #20a0ff;
  }
}
.wan {
  .sc(16px, #333);
}
</style>
