<template>
  <div>
    <head-top></head-top>
    <el-row style="margin-top: 20px;">
      <el-col :span="12" :offset="4">
        <el-form
          :model="formData"
          :rules="rules"
          ref="formData"
          label-width="150px"
          class="demo-formData"
        >
          <el-form-item label="投保保額">
            <el-cascader
              :options="categoryOptions"
              v-model="selectedCategory"
              change-on-select
            ></el-cascader>
          </el-form-item>

          <el-form-item label="假日意外身故/失能">
            <el-cascader
              :options="categoryOptions"
              v-model="selectedCategory"
              change-on-select
            ></el-cascader>
          </el-form-item>

          <el-form-item label="假日交通意外身故(註)">
            <el-cascader
              :options="categoryOptions"
              v-model="selectedCategory"
              change-on-select
            ></el-cascader>
          </el-form-item>

          <el-form-item class="button_submit">
            <el-button type="primary" @click="submitForm('formData')"
              >產生報表</el-button
            >
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import headTop from "@/components/headTop";
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
      city: {},
      formData: {
        name: "", //店铺名称
        address: "", //地址
        latitude: "",
        longitude: "",
        description: "", //介绍
        phone: "",
        promotion_info: "",
        float_delivery_fee: 5, //运费
        float_minimum_order_amount: 20, //起价
        is_premium: true,
        delivery_mode: true,
        new: true,
        bao: true,
        zhun: true,
        piao: true,
        startTime: "",
        endTime: "",
        image_path: "",
        business_license_image: "",
        catering_service_license_image: ""
      },
      rules: {
        name: [{ required: true, message: "请输入店铺名称", trigger: "blur" }],
        address: [
          { required: true, message: "请输入详细地址", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "请输入联系电话" },
          { type: "number", message: "电话号码必须是数字" }
        ]
      },
      options: [
        {
          value: "50萬",
          label: "50萬"
        },
        {
          value: "100萬",
          label: "100萬"
        },
        {
          value: "150萬",
          label: "150萬"
        },
        {
          value: "200萬",
          label: "200萬"
        }
      ],
      activityValue: "50萬",
      activities: [
        {
          icon_name: "减",
          name: "满减优惠",
          description: "满30减5，满60减8"
        }
      ],
      baseUrl,
      baseImgPath,
      categoryOptions: [],
      selectedCategory: ["快餐便当", "简餐"]
    };
  },
  components: {
    headTop
  },
  mounted() {
    this.initData();
  },
  methods: {
    async initData() {
      try {
        this.city = await cityGuess();
        const categories = await foodCategory();
        categories.forEach(item => {
          if (item.sub_categories.length) {
            const addnew = {
              value: item.name,
              label: item.name,
              children: []
            };
            item.sub_categories.forEach((subitem, index) => {
              if (index == 0) {
                return;
              }
              addnew.children.push({
                value: subitem.name,
                label: subitem.name
              });
            });
            this.categoryOptions.push(addnew);
          }
        });
      } catch (err) {
        console.log(err);
      }
    },
    async querySearchAsync(queryString, cb) {
      if (queryString) {
        try {
          const cityList = await searchplace(this.city.id, queryString);
          if (cityList instanceof Array) {
            cityList.map(item => {
              item.value = item.address;
              return item;
            });
            cb(cityList);
          }
        } catch (err) {
          console.log(err);
        }
      }
    },
    addressSelect(address) {
      this.formData.latitude = address.latitude;
      this.formData.longitude = address.longitude;
      console.log(this.formData.latitude, this.formData.longitude);
    },
    handleShopAvatarScucess(res, file) {
      if (res.status == 1) {
        this.formData.image_path = res.image_path;
      } else {
        this.$message.error("上传图片失败！");
      }
    },
    handleBusinessAvatarScucess(res, file) {
      if (res.status == 1) {
        this.formData.business_license_image = res.image_path;
      } else {
        this.$message.error("上传图片失败！");
      }
    },
    handleServiceAvatarScucess(res, file) {
      if (res.status == 1) {
        this.formData.catering_service_license_image = res.image_path;
      } else {
        this.$message.error("上传图片失败！");
      }
    },
    beforeAvatarUpload(file) {
      const isRightType =
        file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isRightType) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isRightType && isLt2M;
    },
    tableRowClassName(row, index) {
      if (index === 1) {
        return "info-row";
      } else if (index === 3) {
        return "positive-row";
      }
      return "";
    },
    selectActivity() {
      this.$prompt("请输入活动详情", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          if (value == null) {
            this.$message({
              type: "info",
              message: "请输入活动详情"
            });
            return;
          }
          let newObj = {};
          switch (this.activityValue) {
            case "满减优惠":
              newObj = {
                icon_name: "减",
                name: "满减优惠",
                description: value
              };
              break;
            case "优惠大酬宾":
              newObj = {
                icon_name: "特",
                name: "优惠大酬宾",
                description: value
              };
              break;
            case "新用户立减":
              newObj = {
                icon_name: "新",
                name: "新用户立减",
                description: value
              };
              break;
            case "进店领券":
              newObj = {
                icon_name: "领",
                name: "进店领券",
                description: value
              };
              break;
          }
          this.activities.push(newObj);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入"
          });
        });
    },
    handleDelete(index) {
      this.activities.splice(index, 1);
    },
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        // 檢核

        var tokenData = {
          username: "henry.chang@ebaotech.com",
          password: "Sve13818"
        };
        let result = await getToken(tokenData);

        alert("中台 token : " + result.access_token);

        try {
          let result = await addShop(this.formData);
          if (result.status == 1) {
            this.$message({
              type: "success",
              message: "添加成功"
            });
            this.formData = {
              name: "", //店铺名称
              address: "", //地址
              latitude: "",
              longitude: "",
              description: "", //介绍
              phone: "",
              promotion_info: "",
              float_delivery_fee: 5, //运费
              float_minimum_order_amount: 20, //起价
              is_premium: true,
              delivery_mode: true,
              new: true,
              bao: true,
              zhun: true,
              piao: true,
              startTime: "",
              endTime: "",
              image_path: "",
              business_license_image: "",
              catering_service_license_image: ""
            };
            this.selectedCategory = ["快餐便当", "简餐"];
            this.activities = [
              {
                icon_name: "减",
                name: "满减优惠",
                description: "满30减5，满60减8"
              }
            ];
          } else {
            this.$message({
              type: "error",
              message: result.message
            });
          }
          console.log(result);
        } catch (err) {
          console.log(err);
        }
      });
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
