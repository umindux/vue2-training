<template>
  <div class="manage_page fillcontain">
    <el-row style="height: 100%;">
      <el-col :span="4" style="min-height: 100%; background-color: #324057;">
        <el-menu
          :default-active="defaultActive"
          style="min-height: 100%;"
          theme="dark"
          router
        >
          <el-menu-item index="manage"
            ><i class="el-icon-menu"></i>首页</el-menu-item
          >
          <!--  -->
          <el-submenu index="8">
            <template slot="title"
              ><i class="el-icon-warning"></i>報表列印</template
            >
            <el-menu-item index="report">報表列印</el-menu-item>
          </el-submenu>
          <el-submenu index="9">
            <template slot="title"
              ><i class="el-icon-setting"></i>聊天機器人</template
            >
            <el-menu-item index="chatbot">聊天機器人</el-menu-item>
          </el-submenu>

          <el-submenu index="10">
            <template slot="title"
              ><i class="el-icon-document"></i>雲端硬碟</template
            >
            <el-menu-item index="cloudDisk">雲端硬碟</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-col>
      <el-col :span="20" style="height: 100%;overflow: auto;">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  computed: {
    defaultActive: function() {
      return this.$route.path.replace("/", "");
    }
  }
};
</script>


<style lang="less" scoped>
@import "../style/mixin";
.manage_page {
}
</style>
