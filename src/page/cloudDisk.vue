<template>
  <div class="fillcontain">
    <head-top></head-top>
    <header class="admin_title">雲端硬碟</header>
    <el-form
      :model="formData"
      :rules="rules"
      ref="formData"
      label-width="80px"
      class="demo-formData"
    >
      <div class="cloudSet">
        <el-row :gutter="20" type="flex" class="row-bg" justify="center">
          <el-col :span="6" style="margin-top: 20px;">
            <el-form-item label="檔案名稱" prop="name">
              <el-input v-model="formData.name"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" style="margin-top: 20px;">
            <el-upload
              ref="upload"
              :auto-upload="false"
              :file-list="fileList"
              :multiple="false"
              :limit="1"
              :on-exceed="handleExceed"
              :http-request="uploadFiles"
              accept="image/jpeg,image/gif,image/png"
              action=""
              :on-change="changeUpload"
            >
              <el-button slot="trigger" type="primary">選取圖片</el-button>
              <span> </span>
              <el-button type="primary" @click="uploadFiles()">提交</el-button>
            </el-upload>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <br />
    <div class="table_container">
      <el-table :data="tableData" highlight-current-row style="width: 100%">
        <el-table-column type="index" width="50"> </el-table-column>
        <el-table-column property="bucketName" label="雲盤名稱" width="130">
        </el-table-column>
        <el-table-column property="createDate" label="建檔日期" width="220">
        </el-table-column>
        <el-table-column property="updateDate" label="更新日期" width="220">
        </el-table-column>
        <el-table-column property="key" label="檔案名稱" width="320">
        </el-table-column>
        <el-table-column property="size" label="檔案大小"> </el-table-column>
        <el-table-column label="下載">
          <template slot-scope="scope">
            <el-button
              size="small"
              @click="downloadPDF(scope.$index, scope.row)"
              >檔案下載</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <div class="Pagination" style="text-align: left;margin-top: 10px;">
        <el-col :span="6">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="20"
            layout="total, prev, pager, next"
            :total="count"
          >
          </el-pagination>
        </el-col>
        <el-col :span="6">
          <el-form
            :model="formData"
            :rules="rules"
            label-width="40px"
            class="demo-formData"
          >
            <el-row>
              <el-col :span="1">
                <el-form-item class="button_submit">
                  <el-button type="primary" @click="initData()">查詢</el-button>
                </el-form-item></el-col
              >
            </el-row>
          </el-form>
        </el-col>
      </div>
    </div>
  </div>
</template>

<script>
import headTop from "../components/headTop";
import { mapActions, mapState } from "vuex";
import { baseUrl, baseImgPath } from "@/config/env";
import {
  getUserList,
  getUserCount,
  clouddisObjectList,
  clouddisObjectGetobject,
  clouddisObjectPutobject,
  getToken
} from "@/api/getData";

export default {
  data() {
    return {
      formData: {
        name: "", //店铺名称
        image_path: ""
      },
      baseUrl,
      baseImgPath,
      tableData: [],
      currentRow: null,
      offset: 0,
      limit: 20,
      count: 0,
      currentPage: 1
    };
  },
  components: {
    headTop
  },
  computed: {
    ...mapState(["adminInfo"])
  },
  created() {
    this.initData();
  },
  methods: {
    async initData() {
      try {
        // 清空表格資料
        this.tableData = [];

        var body = {
          bucketName: "TRAINING",
          prefix: ""
        };
        const countData = await clouddisObjectList(body);
        if (countData.status == "Ok") {
          this.count = 3;
        } else {
          throw new Error("數據讀取失敗");
        }

        countData.body.forEach(item => {
          const tableData = {};
          tableData.tenant = item.tenant;
          tableData.createDate = item.createDate;
          tableData.updateDate = item.updateDate;
          tableData.bucketName = item.bucketName;
          tableData.key = item.key;
          tableData.size =
            Math.round((item.size / 1024 / 1024) * 100) / 100 + " MB";
          this.tableData.push(tableData);
        });
      } catch (err) {
        console.log("讀取數據失敗", err);
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.offset = (val - 1) * this.limit;
    },
    handleShopAvatarScucess(res, file) {
      if (res.status == 1) {
        this.formData.image_path = res.image_path;
      } else {
        this.$message.error("上傳失敗！");
      }
    },
    beforeAvatarUpload(file) {
      // const isRightType = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      //if (!isRightType) {
      //  this.$message.error("上传头像图片只能是 JPG 格式!");
      //}
      if (!isLt2M) {
        this.$message.error("上傳檔案不能過2MB!");
      }
      return isRightType && isLt2M;
    },
    async downloadPDF(index, row) {
      try {
        var body = {
          bucketName: row.bucketName,
          key: row.key
        };
        const countData = await clouddisObjectGetobject(body);
        if (countData.status == "Ok") {
          const fileBase = countData.body.content;
          const fileName = row.key.substring(
            row.key.toLowerCase().indexOf("/") + 1
          );

          let fileType = "";
          if (row.key.toLowerCase().indexOf("png") > -1) {
            fileType = "data:image/png;";
          } else if (row.key.toLowerCase().indexOf("jpg") > -1) {
            fileType = "data:image/jpg;";
          } else if (row.key.toLowerCase().indexOf("json") > -1) {
            fileType = "data:application/json;";
          } else if (row.key.toLowerCase().indexOf("pdf") > -1) {
            fileType = "data:application/pdf;";
          }

          let imgUrl = "";
          if (fileBase.toLowerCase().indexOf("data:") > -1) {
            imgUrl = fileBase;
          } else {
            const prefixBase64 = fileType + "base64,";
            imgUrl = prefixBase64 + fileBase;
          }

          const a = document.createElement("a");
          a.href = imgUrl;
          a.setAttribute("download", fileName);
          a.click();
        } else {
          throw new Error("下載檔案失敗!");
        }
      } catch (err) {
        console.log("获取数据失败", err);
      }
    },
    submitForm(formName) {
      var That = this;
      let file = this.$refs.upload.$refs["upload-inner"].$refs.input; //獲取檔案資料

      let fileList = file.files;
      var imgFile;

      let reader = new FileReader(); //html5讀檔案
      reader.readAsDataURL(fileList[0]); //轉BASE64
      reader.onload = function(e) {
        //讀取完畢後呼叫介面
        imgFile = e.target.result;
        let obj = {
          id: "loginLogo",
          configGroup: "logo",
          configItem: "loginLogo",
          itemValue: imgFile
        };
        return BaseApi.uploadFiles(obj).then(res => {
          if (res.status == "SUCCESS") {
            AlertBox("圖片上傳成功！", "success", true).then(() => {
              return That.getSysLogo(); //呼叫獲取base64資料介面
            });
          } else {
            Alert("圖片上傳失敗", res);
            return "";
          }
        });
      };
    },
    uploadFiles() {
      var That = this;
      let file = this.$refs.upload.$refs["upload-inner"].$refs.input; //獲取檔案資料
      let fileList = file.files;
      var imgFile;
      let reader = new FileReader(); //html5讀檔案
      reader.readAsDataURL(fileList[0]); //轉BASE64
      reader.onload = async function(e) {
        //讀取完畢後呼叫介面
        imgFile = e.target.result;
        let body = {
          bucketName: "TRAINING",
          metadata: {
            data: {
              expirationTime: 60
            }
          },
          key: "REPORT/" + fileList[0].name,
          content: imgFile
        };
        const clouddisData = await clouddisObjectPutobject(body);
        if (clouddisData.status == "Ok") {
          alert("上傳成功！");
        } else {
          alert("上傳失敗！");
        }
      };
      this.$refs.upload.clearFiles();
    }
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
.cloudSet {
  width: 98%;
  background-color: #f9fafc;
  min-height: 150px;
  margin: 20px auto 0;
  border-radius: 10px;
  ul > li {
    padding: 20px;
    span {
      color: #666;
    }
  }
}
</style>
