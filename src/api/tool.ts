import { api } from './http'
import type {
  CreateToolAdminReq,
  UpdateToolAdminReq,
  ListToolsAdminReq,
  ToolDetail,
  ToolListResponse,
  ToolStatsResponse,
} from '@/types/tool'

// 创建工具
export const createTool = async (params: CreateToolAdminReq): Promise<ToolDetail> => {
  return await api.post('/v1/admin/tools', params)
}

// 查询工具列表
export const listTools = async (params: ListToolsAdminReq): Promise<ToolListResponse> => {
  return await api.get('/v1/admin/tools', { params })
}

// 获取工具详情
export const getTool = async (id: string): Promise<ToolDetail> => {
  return await api.get(`/v1/admin/tools/${id}`)
}

// 更新工具
export const updateTool = async (params: UpdateToolAdminReq): Promise<ToolDetail> => {
  return await api.put(`/v1/admin/tools/${params.id}`, params)
}

// 删除工具
export const deleteTool = async (id: string): Promise<void> => {
  return await api.delete(`/v1/admin/tools/${id}`)
}

// 获取工具统计信息
export const getToolStats = async (): Promise<ToolStatsResponse> => {
  return await api.get('/v1/admin/tools/stats')
}

// 兼容旧API - 查询工具分页列表
export const getToolPageListAPI = async (
  params: ListToolsAdminReq,
): Promise<ToolListResponse> => {
  return await api.get('/v1/admin/tools', { params })
}

// 兼容旧API - 更新工具状态
export const updateToolStatusAPI = async (id: string, isEnable: boolean): Promise<ToolDetail> => {
  return await api.put(`/v1/admin/tools/${id}`, { id, isEnable })
}

// 兼容旧API - 删除工具
export const deleteToolAPI = deleteTool
