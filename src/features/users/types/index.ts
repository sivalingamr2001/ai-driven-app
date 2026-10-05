export type UserRole = "admin" | "owner" | "editor" | "member"
export type UserStatus = "active" | "inactive" | "pending" | "suspended"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  avatarUrl?: string
  department?: string
  lastActive: string
  createdAt: string
}

export type UserSortField = "name" | "email" | "role" | "status" | "createdAt"
export type SortOrder = "asc" | "desc"

export interface UsersQueryParams {
  search?: string
  role?: UserRole | "all"
  status?: UserStatus | "all"
  sortBy?: UserSortField
  sortOrder?: SortOrder
  page?: number
  pageSize?: number
}

export interface PaginatedUsersResponse {
  data: User[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface CreateUserInput {
  name: string
  email: string
  role: UserRole
  status: UserStatus
  department?: string
}

export interface UpdateUserInput {
  name?: string
  email?: string
  role?: UserRole
  status?: UserStatus
  department?: string
}
