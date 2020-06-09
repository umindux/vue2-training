<template>
<div>
    <head-top></head-top>
    <p class="explain_text">INSUREMO REPORT 練習</p>
    <p class="explain_text">輸入緯度資訊查詢附近旅遊景點</p>
    <p class="explain_text">顯示結果後並印出報表</p>
    <div>    
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
    <div class="table_container">           
          <el-table :data="tableData"                                         
                    :row-key="row => row.index" 
                    highlight-current-row
                    style="width: 100%">              
              <el-table-column type="index" width="50"></el-table-column>
              <el-table-column property="name" label="景點"></el-table-column>
              <el-table-column property="introduction" label="景點介紹"></el-table-column>
              <el-table-column property="address" label="地址"></el-table-column>                               
          </el-table>                
    </div>
     <div class="Pagination">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-size="20"
                  layout="total, prev, pager, next"
                  :total="count">
                </el-pagination>
       </div>
</div>
</template>

<script>
import headTop from "@/components/headTop";
import {
    login,
    getAdminInfo,
    getToken,
    getTravelSpots
} from "@/api/getData";
import {
    mapActions,


    mapState
} from "vuex";

export default {
    data() {
        return {
            spotForm: {
                nlat: "25",  // for test data
                elong: "112" // for test data
            },
            rules: {
                nlat: [{
                    required: true,
                    message: "查詢附近景點，經緯度(北緯) ex 25",
                    trigger: "blur"
                }],
                elong: [{
                    required: true,
                    message: "查詢附近景點，經緯度(東經) ex 112",
                    trigger: "blur"
                }]
            },
            showLogin: false,
            tableData: [],
            expendRow: [],
            currentPage: 1,            
            count: 399,
            offset: 0,
            limit: 5,
        };
    },
    components: {
        headTop,
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
            this.tableData = [];
            try {
                const travelSpots = await getTravelSpots({
                    nlat: this.spotForm.nlat,
                    elong: this.spotForm.elong
                });                
                //console.log(travelSpots);
                this.count = travelSpots.total;

                travelSpots.data.forEach((item, index) => {
                    const tableData = {};
                    tableData.name = item.name;
                    tableData.introduction = item.introduction;
                    tableData.address = item.address;                   
                    this.tableData.push(tableData);
                    console.log(item);
                })                
            } catch (err) {
                console.error(err.message);
                this.$router.push("/");
            }
        },       
        handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
                this.currentPage = val;
                this.offset = (val - 1) * this.limit;
                this.getTravelSpots();
        },
    }
};
</script>

<style lang="less">
@import "../style/mixin";

.demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
    .table_container{
        padding: 20px;
    }
    .Pagination{
        display: flex;
        justify-content: flex-start;
        margin-top: 8px;
    }

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
