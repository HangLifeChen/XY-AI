import { api } from './http'
import type {
  Employee,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  EmployeeQueryParams,
} from '@/types/employee'

// 员工列表响应接口（标准格式）
export interface EmployeeListResponse {
  employees: Employee[]
  total: number
}

// 员工列表响应接口（兼容旧格式）
export interface EmployeePageListResponse {
  records: Employee[]
  total: number
}

// 创建员工
export const createEmployee = async (params: CreateEmployeeRequest): Promise<Employee> => {
  return await api.post('/v1/employees/create', params)
}

// 获取员工详情
export const getEmployee = async (id: string): Promise<Employee> => {
  return await api.get(`/v1/employees/${id}`)
}

// 更新员工信息
export const updateEmployee = async (params: UpdateEmployeeRequest): Promise<Employee> => {
  return await api.put('/v1/employees/update', params)
}

// 删除员工
export const deleteEmployee = async (id: string): Promise<void> => {
  return await api.delete(`/v1/employees/${id}`)
}

// 查询员工列表
export const listEmployees = async (params: EmployeeQueryParams): Promise<EmployeeListResponse> => {
  return await api.get('/v1/employees/list', { params })
}

// 兼容旧API - 查询员工分页列表
export const getEmployeePageListAPI = async (
  params: EmployeeQueryParams,
): Promise<EmployeePageListResponse> => {
  const response: EmployeeListResponse = await api.get('/v1/employees/list', { params })
  // 将 employees 字段映射为 records 字段，以兼容旧代码
  return {
    records: response.employees || [],
    total: response.total || 0,
  }
}

// 兼容旧API - 更新员工状态
export const updateEmployeeStatusAPI = async (id: string, status: number): Promise<Employee> => {
  return await api.put('/v1/employees/update', { id, status })
}

// 兼容旧API - 删除员工
export const deleteEmployeeAPI = deleteEmployee
