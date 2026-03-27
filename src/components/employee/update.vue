<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { getEmployee, updateEmployee } from '@/api/employee'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { Gender, EmployeeStatus } from '@/types/employee'
import type { UpdateEmployeeRequest, Employee } from '@/types/employee'

// ------ 数据 ------
const userStore = useUserStore()

const formLabelWidth = '80px'
const id = ref('')
const form = reactive<UpdateEmployeeRequest>({
  id: '',
  employeeNo: '',
  name: '',
  username: '',
  phone: '',
  email: '',
  departmentId: '',
  position: '',
  hireDate: '',
  gender: Gender.Unknown,
  status: EmployeeStatus.Active,
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
const statusOptions = [
  {
    value: EmployeeStatus.Active,
    label: '在职',
  },
  {
    value: EmployeeStatus.Inactive,
    label: '离职',
  }
]
const updateRef = ref()

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

// 修改员工信息后提交
const submit = async () => {
  try {
    const valid = await updateRef.value.validate();
    if (valid) {
      console.log('submit')
      console.log(form)
      // 在这里执行表单提交操作
      await updateEmployee(form)
      // 如果修改的是当前用户信息，那么可能会更新当前登录系统员工的账号，即需要更新store的account值
      console.log('当前userStore.id')
      console.log(userStore.userInfo)
      if (userStore.userInfo && userStore.userInfo.id === form.id) {
        const employee = await getEmployee(form.id)
        console.log('查询修改后的员工')
        console.log(employee)
        userStore.username = employee.username
      }
      // 然后进行 消息提示，页面跳转 等操作
      ElMessage({
        message: '修改员工信息成功',
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
  if (route.query && route.query.id) {
    id.value = route.query.id as string
    form.id = id.value
    const employee = await getEmployee(id.value)
    console.log(employee)
    Object.assign(form, employee)
    console.log(form)
  } else {
    console.log('没有id')
  }
  console.log(id)
}

init()
</script>

<template>
  <h1>修改员工页</h1>
  <el-card>
    <el-form :model="form" :rules="rules" ref="updateRef">
      <el-form-item label="员工编号" :label-width="formLabelWidth" prop="employeeNo">
        <el-input v-model="form.employeeNo" autocomplete="off" />
      </el-form-item>
      <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="账号" :label-width="formLabelWidth" prop="username">
        <el-input v-model="form.username" autocomplete="off" />
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
      <el-form-item label="状态" :label-width="formLabelWidth" prop="status">
        <el-select clearable v-model="form.status" placeholder="选择状态">
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" :label-width="formLabelWidth" prop="remark">
        <el-input v-model="form.remark" type="textarea" autocomplete="off" />
      </el-form-item>
    </el-form>
    <el-form-item class="btn_box">
      <el-button class="submit_btn" type="success" @click="submit">修改</el-button>
      <el-button class="cancel_btn" type="info" plain @click="cancel">取消</el-button>
    </el-form-item>
  </el-card>
</template>

<style lang="less" scoped>

</style>
