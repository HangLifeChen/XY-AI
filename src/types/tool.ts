// 工具类型枚举
export enum ToolType {
  Unknown = 0,   // 未知
  Mcp = 1,       // MCP工具
  Http = 2,      // HTTP工具
}

// MCP配置接口
export interface McpConfig {
  url: string                    // MCP服务URL
  headers?: Record<string, string>  // 请求头
  timeout?: number               // 超时时间（毫秒）
}

// 创建工具请求接口
export interface CreateToolReq {
  name: string                   // 工具名称
  description: string            // 工具描述
  toolType: ToolType             // 工具类型
  isEnable: boolean              // 是否启用
  mcpConfig?: McpConfig          // MCP配置
}

// 查询工具列表请求接口
export interface ListToolsReq {
  name?: string                  // 工具名称
  type?: ToolType                // 工具类型
  page?: number                  // 页码
  pageSize?: number              // 每页数量
}

// 更新工具请求接口
export interface UpdateToolReq {
  name: string                   // 工具名称
  description: string            // 工具描述
  toolType: ToolType             // 工具类型
  isEnable: boolean              // 是否启用
  mcpConfig?: McpConfig          // MCP配置
}

// 测试工具请求接口
export interface TestToolReq {
  params: Record<string, unknown>  // 测试参数
}

// ============== 管理员请求类型 ==============

// 创建工具请求接口（管理员）
export interface CreateToolAdminReq {
  name: string                   // 工具名称
  description: string            // 工具描述
  toolType: ToolType             // 工具类型
  isEnable: boolean              // 是否启用
  mcpConfig?: McpConfig          // MCP配置
  creatorId: string              // 创建者ID (UUID)
}

// 更新工具请求接口（管理员）
export interface UpdateToolAdminReq {
  id: string                     // 工具ID (UUID)
  name: string                   // 工具名称
  description: string            // 工具描述
  toolType: ToolType             // 工具类型
  isEnable: boolean              // 是否启用
  mcpConfig?: McpConfig          // MCP配置
}

// 查询工具列表请求接口（管理员）
export interface ListToolsAdminReq {
  name?: string                  // 工具名称
  type?: ToolType                // 工具类型
  creatorId?: string             // 创建者ID (UUID)
  isEnable?: boolean             // 是否启用
  page?: number                  // 页码
  pageSize?: number              // 每页数量
}
