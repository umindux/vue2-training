<template>
  <div>
    <head-top></head-top>
    <p class="explain_text">INSUREMO REPORT 練習</p>
    <p class="explain_text">輸入緯度資訊查詢附近旅遊景點</p>
    <p class="explain_text">顯示結果後並印出報表</p>
    <el-row style="margin-top: 20px;">
      <el-col :span="12" :offset="4">
        <el-form :model="spotForm" :rules="rules" ref="spotForm">
          <el-form-item prop="nlat">
            <el-input v-model="spotForm.nlat" placeholder="北緯">
              <span>dsfsf</span>
            </el-input>
          </el-form-item>
          <el-form-item prop="elong">
            <el-input type="elong" placeholder="東經" v-model="spotForm.elong"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('spotForm')" class="submit_btn">查詢</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import headTop from "@/components/headTop";
import { login, getAdminInfo, getToken, getTravelSpots } from "@/api/getData";
import { mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      spotForm: {
        nlat: "",
        elong: ""
      },
      rules: {
        nlat: [
          {
            required: true,
            message: "查詢附近景點，經緯度(北緯) ex 25",
            trigger: "blur"
          }
        ],
        elong: [
          {
            required: true,
            message: "查詢附近景點，經緯度(東經) ex 112",
            trigger: "blur"
          }
        ]
      },
      showLogin: false
    };
  },
  components: {
    headTop
  },
  mounted() {
    // this.showLogin = true;
    // if (!this.adminInfo.id) {
    // 	this.getAdminData()
    // }
  },
  computed: {
    ...mapState(["adminInfo"])
  },
  methods: {
    ...mapActions(["getAdminData"]),
    async submitForm(formName) {
      console.log("input[nlat]" + this.spotForm.nlat);
      console.log("input[elong]" + this.spotForm.elong);

	  
      var tokenData = {
        username: "umin.chen@ebaotech.com",
        password: "@1eIHMgx"
      };

      let result = await getToken(tokenData);

      try {
        let result = await getTravelSpots({
          nlat: this.spotForm.nlat,
          elong: this.spotForm.elong
        });
        console.log(result);



      } catch (err) {
        console.error(err);
      }
    }
  }
};
</script>

<style lang="less">
@import "../style/mixin";
.button_submit {
  text-align: center;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #20a0ff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
.el-table .info-row {
  background: #c9e5f5;
}

.el-table .positive-row {
  background: #e2f0e4;
}
</style>
