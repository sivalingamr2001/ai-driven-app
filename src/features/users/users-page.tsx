import * as React from "react"
import { useUsers } from "./hooks/use-users"
import { usersApi } from "./services/users-api"
import { UsersHeader } from "./components/users-header"
import { UsersToolbar } from "./components/users-toolbar"
import { UsersTable } from "./components/users-table"
import { UsersPagination } from "./components/users-pagination"
import { UserDialog } from "./components/user-dialog"
import { DeleteUserDialog } from "./components/delete-user-dialog"
import type { CreateUserInput, UpdateUserInput, User } from "./types"

export function UsersPage() {
  const {
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
    setPageSize,
    setSearch,
    setRole,
    setStatus,
    handleSort,
    resetFilters,
    toggleSelectAll,
    toggleSelectRow,
    refetch,
    createUser,
    updateUser,
    deleteUser,
    bulkDelete,
  } = useUsers()

  const [isAddOpen, setIsAddOpen] = React.useState(false)
  const [editingUser, setEditingUser] = React.useState<User | null>(null)
  const [deletingUser, setDeletingUser] = React.useState<User | null>(null)
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = React.useState(false)
  const [isErrorSimulated, setIsErrorSimulated] = React.useState(false)

  const handleToggleSimulateError = () => {
    const next = !isErrorSimulated
    setIsErrorSimulated(next)
    usersApi.setSimulateError(next)
    refetch()
  }

  const handleRetry = () => {
    setIsErrorSimulated(false)
    usersApi.setSimulateError(false)
    refetch()
  }

  const handleAddSubmit = async (data: CreateUserInput | UpdateUserInput) => {
    await createUser(data as CreateUserInput)
  }

  const handleEditSubmit = async (data: CreateUserInput | UpdateUserInput) => {
    if (!editingUser) return
    await updateUser(editingUser.id, data)
    setEditingUser(null)
  }

  const handleConfirmSingleDelete = async () => {
    if (!deletingUser) return
    await deleteUser(deletingUser.id)
    setDeletingUser(null)
  }

  const handleConfirmBulkDelete = async () => {
    await bulkDelete()
    setIsBulkDeleteOpen(false)
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Page Header */}
      <UsersHeader
        onAddUser={() => setIsAddOpen(true)}
        onRefresh={refetch}
        isRefreshing={isLoading}
        onToggleSimulateError={handleToggleSimulateError}
        isErrorSimulated={isErrorSimulated}
      />

      {/* Toolbar / Filters */}
      <UsersToolbar
        search={search}
        onSearchChange={setSearch}
        role={role}
        onRoleChange={setRole}
        status={status}
        onStatusChange={setStatus}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={resetFilters}
        selectedCount={selectedIds.size}
        totalCount={total}
        onBulkDelete={() => setIsBulkDeleteOpen(true)}
      />

      {/* Main Table */}
      <UsersTable
        users={users}
        isLoading={isLoading}
        error={error}
        selectedIds={selectedIds}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        onToggleSelectAll={toggleSelectAll}
        onToggleSelectRow={toggleSelectRow}
        onEditUser={(user) => setEditingUser(user)}
        onDeleteUser={(user) => setDeletingUser(user)}
        onRetry={handleRetry}
        onResetFilters={resetFilters}
      />

      {/* Pagination (only when not in error state and not empty loading) */}
      {!error && (
        <UsersPagination
          page={page}
          pageSize={pageSize}
          total={total}
          totalPages={totalPages}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      )}

      {/* Create User Dialog */}
      <UserDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onSubmit={handleAddSubmit}
      />

      {/* Edit User Dialog */}
      <UserDialog
        open={Boolean(editingUser)}
        onOpenChange={(open) => !open && setEditingUser(null)}
        user={editingUser}
        onSubmit={handleEditSubmit}
      />

      {/* Delete User Confirmation */}
      <DeleteUserDialog
        open={Boolean(deletingUser)}
        onOpenChange={(open) => !open && setDeletingUser(null)}
        user={deletingUser}
        onConfirm={handleConfirmSingleDelete}
        isDeleting={isMutating}
      />

      {/* Bulk Delete Confirmation */}
      <DeleteUserDialog
        open={isBulkDeleteOpen}
        onOpenChange={setIsBulkDeleteOpen}
        bulkCount={selectedIds.size}
        onConfirm={handleConfirmBulkDelete}
        isDeleting={isMutating}
      />
    </div>
  )
}
