<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { createEmployee } from '@/api/employee'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Gender } from '@/types/employee'
import type { CreateEmployeeRequest } from '@/types/employee'

// ------ 数据 ------
const formLabelWidth = '80px'
const form = reactive<CreateEmployeeRequest>({
  employeeNo: '',
  name: '',
  username: '',
  password: '',
  phone: '',
  email: '',
  departmentId: '',
  position: '',
  hireDate: '',
  gender: Gender.Unknown,
  status: 1,
  remark: '',
})
const genderOptions = [
  {
    value: Gender.Male,
    label: '男',
  },
  {
    value: Gender.Female,
    label: '女',
  },
  {
    value: Gender.Unknown,
    label: '未知',
  }
]
const addRef = ref()

// 表单校验
const rules = {
  employeeNo: [
    { required: true, trigger: 'blur', message: '不能为空' },
  ],
  name: [
    { required: true, trigger: 'blur', message: '不能为空' },
    { min: 2, message: '姓名长度不能少于2个字符', trigger: 'blur' },
    { max: 20, message: '姓名长度不能超过20个字符', trigger: 'blur' },
  ],
  username: [
    { required: true, trigger: 'blur', message: '不能为空' },
    { pattern: /^[a-zA-Z0-9]{1,10}$/, message: '用户名必须是1-10的字母数字', trigger: 'blur' }
  ],
  password: [
    { required: true, trigger: 'blur', message: '不能为空' },
    { pattern: /^\S{6,15}$/, message: '密码必须是6-15的非空字符', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ],
}


// ------ 方法 ------

const router = useRouter()
const route = useRoute()

// 添加员工信息后提交
const submit = async () => {
  try {
    const valid = await addRef.value.validate();
    if (valid) {
      console.log('submit')
      console.log(form)
      // 在这里执行表单提交操作
      await createEmployee(form)
      // 然后进行 消息提示，页面跳转 等操作
      ElMessage({
        message: '新增员工成功',
        type: 'success',
      })
      router.push({
        path: '/employee',
      })
    } else {
      console.log('form not valid!');
      return false;
    }
  } catch (error) {
    console.error('执行过程中失败:', error);
  }
}
// 取消
const cancel = () => {
  router.push({
    path: '/employee',
  })
}

const init = async () => {
  console.log(route.query)
}

init()
</script>

<template>
  <h1>添加员工页</h1>
  <el-card>
    <el-form :model="form" :rules="rules" ref="addRef">
      <el-form-item label="员工编号" :label-width="formLabelWidth" prop="employeeNo">
        <el-input v-model="form.employeeNo" autocomplete="off" />
      </el-form-item>
      <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="账号" :label-width="formLabelWidth" prop="username">
        <el-input v-model="form.username" autocomplete="off" />
      </el-form-item>
      <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
        <el-input v-model="form.password" autocomplete="off" type="password" />
      </el-form-item>
      <el-form-item label="电话" :label-width="formLabelWidth" prop="phone">
        <el-input v-model="form.phone" autocomplete="off" />
      </el-form-item>
      <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
        <el-input v-model="form.email" autocomplete="off" />
      </el-form-item>
      <el-form-item label="部门ID" :label-width="formLabelWidth" prop="departmentId">
        <el-input v-model="form.departmentId" autocomplete="off" />
      </el-form-item>
      <el-form-item label="职位" :label-width="formLabelWidth" prop="position">
        <el-input v-model="form.position" autocomplete="off" />
      </el-form-item>
      <el-form-item label="入职日期" :label-width="formLabelWidth" prop="hireDate">
        <el-date-picker
          v-model="form.hireDate"
          type="date"
          placeholder="选择入职日期"
          value-format="YYYY-MM-DD"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="性别" :label-width="formLabelWidth" prop="gender">
        <el-select clearable v-model="form.gender" placeholder="选择性别">
          <el-option v-for="item in genderOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" :label-width="formLabelWidth" prop="remark">
        <el-input v-model="form.remark" type="textarea" autocomplete="off" />
      </el-form-item>
    </el-form>
    <el-form-item>
      <el-button class="submit_btn" type="success" @click="submit">添加</el-button>
      <el-button class="cancel_btn" type="info" plain @click="cancel">取消</el-button>
    </el-form-item>
  </el-card>
</template>

<style lang="less" scoped>

</style>
