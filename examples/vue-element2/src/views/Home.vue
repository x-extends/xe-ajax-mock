<template>
  <div v-loading="loading">

    <el-row class="header">
      <img src="../assets/logo.png">
      <h1>{{ $t('app.name') }}</h1>
    </el-row>

    <el-form :inline="true" :model="formData" ref="myForm">
      <el-form-item label="Name" prop="name">
        <el-input v-model="formData.name" placeholder="Name"></el-input>
      </el-form-item>
      <el-form-item label="Address" prop="address">
        <el-input v-model="formData.address" placeholder="Address"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchEvent">查询</el-button>
        <el-button @click="resetForm()">重置</el-button>
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
import { getJSON } from 'xe-ajax'

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
      getJSON('api/user/list').then(data => {
        // 请求失败
        this.loading = false
        this.list = data
      }).catch(data => {
        // 请求成功
        this.loading = false
      })
    },
    resetForm () {
      this.$refs.myForm.resetFields()
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
