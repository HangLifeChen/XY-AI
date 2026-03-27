// 员工状态枚举
export enum EmployeeStatus {
  Inactive = 0,  // 离职
  Active = 1,    // 在职
}

// 性别枚举
export enum Gender {
  Unknown = 0,   // 未知
  Male = 1,      // 男
  Female = 2,    // 女
}

// 员工基本信息接口
export interface Employee {
  id: string                    // 主键ID
  employeeNo: string            // 员工编号
  name: string                  // 姓名
  gender: Gender                // 性别
  phone: string                 // 电话
  email: string                 // 邮箱
  departmentId: string          // 部门ID
  position: string              // 职位
  hireDate: string              // 入职日期 (ISO 时间字符串)
  status: EmployeeStatus        // 状态
  username: string              // 用户名
  password: string              // 密码
  remark: string                // 备注
  createdAt: string             // 创建时间 (ISO 时间字符串)
  updatedAt: string             // 更新时间 (ISO 时间字符串)
}

// 创建员工请求接口
export interface CreateEmployeeRequest {
  employeeNo: string            // 员工编号
  name: string                  // 姓名
  gender?: Gender               // 性别
  phone?: string                // 电话
  email?: string                // 邮箱
  departmentId?: string         // 部门ID
  position?: string             // 职位
  hireDate?: string             // 入职日期
  status?: EmployeeStatus       // 状态
  username?: string             // 用户名
  password?: string             // 密码
  remark?: string               // 备注
}

// 更新员工请求接口
export interface UpdateEmployeeRequest extends Partial<CreateEmployeeRequest> {
  id: string                    // 主键ID
}

// 员工查询参数接口
export interface EmployeeQueryParams {
  employeeNo?: string           // 员工编号
  name?: string                 // 姓名
  departmentId?: string         // 部门ID
  status?: EmployeeStatus       // 状态
  page?: number                 // 页码
  pageSize?: number             // 每页数量
}
