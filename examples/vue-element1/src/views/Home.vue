<template>
  <div v-loading="loading">

    <el-row class="header">
      <img src="../assets/logo.png">
      <h1>{{ $t('app.name') }}</h1>
    </el-row>

    <el-form :inline="true" :model="formData">
      <el-form-item label="Name">
        <el-input v-model="formData.name" placeholder="Name"></el-input>
      </el-form-item>
      <el-form-item label="Address">
        <el-input v-model="formData.address" placeholder="Address"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchEvent">查询</el-button>
        <el-button type="primary" @click="saveEvent">保存</el-button>
      </el-form-item>
    </el-form>

    <el-table
      border
      :data="list"
      class="table-demo">
      <el-table-column
        prop="id"
        label="ID"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="Name"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="Address">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      formData: {
        name: null,
        address: null
      },
      list: []
    }
  },
  methods: {
    init () {
      this.findList()
    },
    searchEvent () {
      this.findList()
    },
    findList () {
      this.loading = true
      this.$ajax.getJSON('api/user/list').then(data => {
        // 请求失败
        this.loading = false
        this.list = data
      }).catch(data => {
        // 请求成功
        this.loading = false
      })
    },
    saveEvent () {
      this.loading = true
      this.$ajax.postJSON('api/user/save', this.formData).then(data => {
        // 请求成功
        this.loading = false
        this.$message({type: 'success', message: data.msg})
      }).catch(data => {
        // 请求失败
        this.loading = false
        this.$message({type: 'error', message: data.msg})
      })
    }
  },
  created () {
    this.init()
  }
}
</script>

<style lang="scss" scoped>
.header {
  text-align: center;
}
.table-demo, .el-form {
  width: 50%;
  margin: 0 auto;
}
</style>
