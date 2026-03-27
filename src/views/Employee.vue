<script setup lang="ts">

import { reactive, ref } from 'vue'
import { getEmployeePageListAPI, updateEmployeeStatusAPI, deleteEmployeeAPI, createEmployee, getEmployee, updateEmployee } from '@/api/employee'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'
import type { Employee, CreateEmployeeRequest, UpdateEmployeeRequest } from '@/types/employee'
import { EmployeeStatus, Gender } from '@/types/employee'

// ------ 数据 ------
const userStore = useUserStore()
// 当前页的员工列表
const employeeList = ref<Employee[]>([])
// 带查询的分页参数
const pageData = reactive({
  name: '',
  page: 1,
  pageSize: 6,
  total: 0
})

// 对话框相关
const dialogVisible = ref(false)
const dialogTitle = ref('')
const isEdit = ref(false)
const formRef = ref()
const formLabelWidth = '100px'

// 表单数据
const formData = reactive<CreateEmployeeRequest & UpdateEmployeeRequest>({
  id: '',
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
  status: EmployeeStatus.Active,
  remark: '',
})

// 性别选项
const genderOptions = [
  { value: Gender.Male, label: '男' },
  { value: Gender.Female, label: '女' },
  { value: Gender.Unknown, label: '未知' }
]

// 状态选项
const statusOptions = [
  { value: EmployeeStatus.Active, label: '在职' },
  { value: EmployeeStatus.Inactive, label: '离职' }
]

// 表单校验规则
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

// 页面初始化
const init = async () => {
  const res = await getEmployeePageListAPI({ page: pageData.page, pageSize: pageData.pageSize, name: pageData.name })
  console.log('员工列表')
  console.log(res)
  employeeList.value = res.records
  pageData.total = res.total
}

init()

// 监听翻页和每页显示数量的变化
const handleCurrentChange = (val: number) => {
  pageData.page = val
  init()
}

const handleSizeChange = (val: number) => {
  pageData.pageSize = val
  init()
}

// 重置表单
const resetForm = () => {
  Object.assign(formData, {
    id: '',
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
    status: EmployeeStatus.Active,
    remark: '',
  })
}

// 打开添加对话框
const openAddDialog = () => {
  isEdit.value = false
  dialogTitle.value = '添加员工'
  resetForm()
  dialogVisible.value = true
}

// 打开编辑对话框
const openEditDialog = async (row: Employee) => {
  isEdit.value = true
  dialogTitle.value = '修改员工'
  try {
    const employee = await getEmployee(row.id)
    Object.assign(formData, employee)
    dialogVisible.value = true
  } catch (error) {
    ElMessage.error('获取员工信息失败')
  }
}

// 提交表单
const submitForm = async () => {
  try {
    const valid = await formRef.value?.validate()
    if (!valid) return

    if (isEdit.value) {
      // 编辑模式
      await updateEmployee(formData as UpdateEmployeeRequest)
      // 如果修改的是当前用户信息，更新store
      if (userStore.userInfo && userStore.userInfo.id === formData.id) {
        const employee = await getEmployee(formData.id)
        userStore.username = employee.username
      }
      ElMessage.success('修改员工成功')
    } else {
      // 添加模式
      await createEmployee(formData as CreateEmployeeRequest)
      ElMessage.success('添加员工成功')
    }
    dialogVisible.value = false
    init()
  } catch (error) {
    console.error('操作失败:', error)
  }
}

// 修改员工状态
const changeStatus = async (row: Employee) => {
  const status = row.status === EmployeeStatus.Active ? EmployeeStatus.Inactive : EmployeeStatus.Active
  await updateEmployeeStatusAPI(row.id, status)
  init()
  ElMessage({
    type: 'success',
    message: '修改状态成功',
  })
}

// 删除员工
const delete_btn = (row: Employee) => {
  ElMessageBox.confirm(
    '该操作会永久删除员工，是否继续？',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  )
    .then(async () => {
      await deleteEmployeeAPI(row.id)
      init()
      ElMessage({
        type: 'success',
        message: '删除成功',
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除',
      })
    })
}

// 获取性别显示文本
const getGenderText = (gender: Gender) => {
  switch (gender) {
    case Gender.Male:
      return '男'
    case Gender.Female:
      return '女'
    default:
      return '未知'
  }
}

// 获取状态显示文本
const getStatusText = (status: EmployeeStatus) => {
  switch (status) {
    case EmployeeStatus.Active:
      return '在职'
    case EmployeeStatus.Inactive:
      return '离职'
    default:
      return '未知'
  }
}
</script>

<template>
  <el-card>
    <div class="horizontal">
      <el-input size="large" class="input" v-model="pageData.name" placeholder="请输入想查询的员工名" />
      <el-button size="large" class="btn" round type="success" @click="init()">查询员工</el-button>
      <el-button size="large" class="btn" type="primary" @click="openAddDialog">
        <el-icon style="font-size: 15px; margin-right: 10px;">
          <Plus />
        </el-icon>添加员工
      </el-button>
    </div>
    <el-table :data="employeeList" stripe>
      <el-table-column prop="name" label="姓名" align="center" />
      <el-table-column prop="username" label="账号" align="center" />
      <el-table-column prop="phone" label="手机号" width="120px" align="center" />
      <el-table-column prop="employeeNo" label="工号" align="center" />
      <el-table-column label="性别" align="center">
        <template #default="scope">
          {{ getGenderText(scope.row.gender) }}
        </template>
      </el-table-column>
      <el-table-column prop="position" label="职位" align="center" />
      <el-table-column prop="status" label="状态" align="center">
        <template #default="scope">
          <el-tag :type="scope.row.status === EmployeeStatus.Active ? 'success' : 'danger'" round>
            {{ getStatusText(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="updatedAt" label="上次操作时间" width="160px" align="center" />
      <el-table-column label="操作" width="200px" align="center">
        <template #default="scope">
          <el-button @click="openEditDialog(scope.row)" type="primary" :disabled="userStore.username !== 'cyh'
            && userStore.username !== scope.row.username ? true : false">修改
          </el-button>
          <el-button @click="changeStatus(scope.row)" plain :type="scope.row.status === EmployeeStatus.Active ? 'danger' : 'primary'"
            :disabled="userStore.username !== 'cyh' ? true : false">
            {{ scope.row.status === EmployeeStatus.Active ? '禁用' : '启用' }}
          </el-button>
          <el-button @click="delete_btn(scope.row)" type="danger"
            :disabled="userStore.username !== 'cyh' ? true : false">删除
          </el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description=" 没有数据" />
      </template>
    </el-table>

    <el-pagination class="page" background layout="total, sizes, prev, pager, next, jumper" :total="pageData.total"
      :page-sizes="[2, 4, 6, 8]" v-model:current-page="pageData.page" v-model:page-size="pageData.pageSize"
      @current-change="handleCurrentChange" @size-change="handleSizeChange" />

    <!-- 添加/编辑员工对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form :model="formData" :rules="rules" ref="formRef" :label-width="formLabelWidth">
        <el-form-item label="员工编号" prop="employeeNo">
          <el-input v-model="formData.employeeNo" autocomplete="off" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formData.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="账号" prop="username">
          <el-input v-model="formData.username" autocomplete="off" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!isEdit">
          <el-input v-model="formData.password" autocomplete="off" type="password" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="formData.phone" autocomplete="off" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" autocomplete="off" />
        </el-form-item>
        <el-form-item label="部门ID" prop="departmentId">
          <el-input v-model="formData.departmentId" autocomplete="off" />
        </el-form-item>
        <el-form-item label="职位" prop="position">
          <el-input v-model="formData.position" autocomplete="off" />
        </el-form-item>
        <el-form-item label="入职日期" prop="hireDate">
          <el-date-picker
            v-model="formData.hireDate"
            type="date"
            placeholder="选择入职日期"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select clearable v-model="formData.gender" placeholder="选择性别" style="width: 100%">
            <el-option v-for="item in genderOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status" v-if="isEdit">
          <el-select clearable v-model="formData.status" placeholder="选择状态" style="width: 100%">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formData.remark" type="textarea" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>


<style lang="less" scoped>
.el-table {
  width: 90%;
  height: 500px;
  margin: 3rem auto;
  text-align: center;
  border: 1px solid #e4e4e4;
}

:deep(.el-table tr) {
  font-size: 12px;
}

.el-button {
  width: 45px;
  font-size: 12px;
}

.el-pagination {
  justify-content: center;
}

.horizontal {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 0 80px;

  .input {
    width: 240px;
  }

  .btn {
    width: 120px;
  }
}
</style>
