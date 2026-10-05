import * as React from "react"
import type {
  CreateUserInput,
  UpdateUserInput,
  User,
  UserRole,
  UserSortField,
  UserStatus,
  SortOrder,
} from "../types"
import { usersApi } from "../services/users-api"

export interface UseUsersOptions {
  initialSearch?: string
  initialRole?: UserRole | "all"
  initialStatus?: UserStatus | "all"
  initialSortBy?: UserSortField
  initialSortOrder?: SortOrder
  initialPageSize?: number
}

export function useUsers(options: UseUsersOptions = {}) {
  const [search, setSearch] = React.useState(options.initialSearch ?? "")
  const [role, setRole] = React.useState<UserRole | "all">(options.initialRole ?? "all")
  const [status, setStatus] = React.useState<UserStatus | "all">(
    options.initialStatus ?? "all"
  )
  const [sortBy, setSortBy] = React.useState<UserSortField>(
    options.initialSortBy ?? "name"
  )
  const [sortOrder, setSortOrder] = React.useState<SortOrder>(
    options.initialSortOrder ?? "asc"
  )
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(options.initialPageSize ?? 10)

  const [users, setUsers] = React.useState<User[]>([])
  const [total, setTotal] = React.useState(0)
  const [totalPages, setTotalPages] = React.useState(1)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set())
  const [isMutating, setIsMutating] = React.useState(false)

  // Fetch users with current query parameters
  const fetchUsers = React.useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await usersApi.getUsers({
        search,
        role,
        status,
        sortBy,
        sortOrder,
        page,
        pageSize,
      })
      setUsers(res.data)
      setTotal(res.total)
      setTotalPages(res.totalPages)
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Try again."
      setError(msg)
      setUsers([])
      setTotal(0)
    } finally {
      setIsLoading(false)
    }
  }, [search, role, status, sortBy, sortOrder, page, pageSize])

  // Synchronize on query changes
  React.useEffect(() => {
    let isCancelled = false
    setIsLoading(true)
    setError(null)

    usersApi
      .getUsers({
        search,
        role,
        status,
        sortBy,
        sortOrder,
        page,
        pageSize,
      })
      .then((res) => {
        if (!isCancelled) {
          setUsers(res.data)
          setTotal(res.total)
          setTotalPages(res.totalPages)
          setIsLoading(false)
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          const msg =
            err instanceof Error ? err.message : "Something went wrong. Try again."
          setError(msg)
          setUsers([])
          setTotal(0)
          setIsLoading(false)
        }
      })

    return () => {
      isCancelled = true
    }
  }, [search, role, status, sortBy, sortOrder, page, pageSize])

  // Reset page to 1 when filters or search change
  const handleSearchChange = React.useCallback((val: string) => {
    setSearch(val)
    setPage(1)
  }, [])

  const handleRoleChange = React.useCallback((val: UserRole | "all") => {
    setRole(val)
    setPage(1)
  }, [])

  const handleStatusChange = React.useCallback((val: UserStatus | "all") => {
    setStatus(val)
    setPage(1)
  }, [])

  const handlePageSizeChange = React.useCallback((val: number) => {
    setPageSize(val)
    setPage(1)
  }, [])

  // Sort toggle handler
  const handleSort = React.useCallback(
    (field: UserSortField) => {
      if (sortBy === field) {
        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
      } else {
        setSortBy(field)
        setSortOrder("asc")
      }
      setPage(1)
    },
    [sortBy]
  )

  // Reset all filters
  const resetFilters = React.useCallback(() => {
    setSearch("")
    setRole("all")
    setStatus("all")
    setPage(1)
  }, [])

  // Row selection handlers
  const toggleSelectAll = React.useCallback(() => {
    if (selectedIds.size === users.length && users.length > 0) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(users.map((u) => u.id)))
    }
  }, [selectedIds.size, users])

  const toggleSelectRow = React.useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const clearSelection = React.useCallback(() => {
    setSelectedIds(new Set())
  }, [])

  // CRUD actions
  const createUser = React.useCallback(
    async (input: CreateUserInput) => {
      setIsMutating(true)
      try {
        const created = await usersApi.createUser(input)
        await fetchUsers()
        return created
      } finally {
        setIsMutating(false)
      }
    },
    [fetchUsers]
  )

  const updateUser = React.useCallback(
    async (id: string, input: UpdateUserInput) => {
      setIsMutating(true)
      try {
        const updated = await usersApi.updateUser(id, input)
        await fetchUsers()
        return updated
      } finally {
        setIsMutating(false)
      }
    },
    [fetchUsers]
  )

  const deleteUser = React.useCallback(
    async (id: string) => {
      setIsMutating(true)
      try {
        await usersApi.deleteUser(id)
        setSelectedIds((prev) => {
          const next = new Set(prev)
          next.delete(id)
          return next
        })
        await fetchUsers()
      } finally {
        setIsMutating(false)
      }
    },
    [fetchUsers]
  )

  const bulkDelete = React.useCallback(async () => {
    if (selectedIds.size === 0) return
    setIsMutating(true)
    try {
      await usersApi.bulkDeleteUsers(Array.from(selectedIds))
      setSelectedIds(new Set())
      await fetchUsers()
    } finally {
      setIsMutating(false)
    }
  }, [selectedIds, fetchUsers])

  const hasActiveFilters = search.trim() !== "" || role !== "all" || status !== "all"

  return {
    users,
    total,
    totalPages,
    page,
    pageSize,
    search,
    role,
    status,
    sortBy,
    sortOrder,
    isLoading,
    isMutating,
    error,
    selectedIds,
    hasActiveFilters,
    setPage,
    setPageSize: handlePageSizeChange,
    setSearch: handleSearchChange,
    setRole: handleRoleChange,
    setStatus: handleStatusChange,
    handleSort,
    resetFilters,
    toggleSelectAll,
    toggleSelectRow,
    clearSelection,
    refetch: fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    bulkDelete,
  }
}
