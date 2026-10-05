import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { UsersTable } from "./users-table"
import type { User } from "../types"

const mockUsers: User[] = [
  {
    id: "usr-001",
    name: "Sarah Chen",
    email: "sarah.chen@acme.corp",
    role: "owner",
    status: "active",
    department: "Executive",
    lastActive: "Just now",
    createdAt: "2024-01-15T09:00:00Z",
  },
  {
    id: "usr-002",
    name: "Marcus Vance",
    email: "marcus.vance@acme.corp",
    role: "admin",
    status: "inactive",
    department: "Engineering",
    lastActive: "Yesterday",
    createdAt: "2024-02-01T10:30:00Z",
  },
]

describe("UsersTable", () => {
  it("renders users data rows correctly", () => {
    render(
      <UsersTable
        users={mockUsers}
        isLoading={false}
        error={null}
        selectedIds={new Set()}
        sortBy="name"
        sortOrder="asc"
        onSort={vi.fn()}
        onToggleSelectAll={vi.fn()}
        onToggleSelectRow={vi.fn()}
        onEditUser={vi.fn()}
        onDeleteUser={vi.fn()}
        onRetry={vi.fn()}
      />
    )

    expect(screen.getByText("Sarah Chen")).toBeInTheDocument()
    expect(screen.getByText("sarah.chen@acme.corp")).toBeInTheDocument()
    expect(screen.getByText("Owner")).toBeInTheDocument()
    expect(screen.getByText("Active")).toBeInTheDocument()

    expect(screen.getByText("Marcus Vance")).toBeInTheDocument()
    expect(screen.getByText("marcus.vance@acme.corp")).toBeInTheDocument()
    expect(screen.getByText("Admin")).toBeInTheDocument()
    expect(screen.getByText("Inactive")).toBeInTheDocument()
  })

  it("renders skeleton bars when loading", () => {
    const { container } = render(
      <UsersTable
        users={[]}
        isLoading={true}
        error={null}
        selectedIds={new Set()}
        sortBy="name"
        sortOrder="asc"
        onSort={vi.fn()}
        onToggleSelectAll={vi.fn()}
        onToggleSelectRow={vi.fn()}
        onEditUser={vi.fn()}
        onDeleteUser={vi.fn()}
        onRetry={vi.fn()}
      />
    )

    const skeletons = container.querySelectorAll("[data-slot='skeleton']")
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it("renders empty state message when no records exist", () => {
    render(
      <UsersTable
        users={[]}
        isLoading={false}
        error={null}
        selectedIds={new Set()}
        sortBy="name"
        sortOrder="asc"
        onSort={vi.fn()}
        onToggleSelectAll={vi.fn()}
        onToggleSelectRow={vi.fn()}
        onEditUser={vi.fn()}
        onDeleteUser={vi.fn()}
        onRetry={vi.fn()}
      />
    )

    expect(screen.getByText("No users found")).toBeInTheDocument()
    expect(screen.getByText(/try adjusting your search/i)).toBeInTheDocument()
  })

  it("renders error state and invokes onRetry", () => {
    const onRetry = vi.fn()
    render(
      <UsersTable
        users={[]}
        isLoading={false}
        error="Server network error occurred"
        selectedIds={new Set()}
        sortBy="name"
        sortOrder="asc"
        onSort={vi.fn()}
        onToggleSelectAll={vi.fn()}
        onToggleSelectRow={vi.fn()}
        onEditUser={vi.fn()}
        onDeleteUser={vi.fn()}
        onRetry={onRetry}
      />
    )

    expect(screen.getByRole("alert")).toBeInTheDocument()
    expect(screen.getByText("Something went wrong.")).toBeInTheDocument()
    expect(screen.getByText("Server network error occurred")).toBeInTheDocument()

    const retryBtn = screen.getByRole("button", { name: /retry loading users/i })
    fireEvent.click(retryBtn)
    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it("triggers onSort when clicking sortable header", () => {
    const onSort = vi.fn()
    render(
      <UsersTable
        users={mockUsers}
        isLoading={false}
        error={null}
        selectedIds={new Set()}
        sortBy="name"
        sortOrder="asc"
        onSort={onSort}
        onToggleSelectAll={vi.fn()}
        onToggleSelectRow={vi.fn()}
        onEditUser={vi.fn()}
        onDeleteUser={vi.fn()}
        onRetry={vi.fn()}
      />
    )

    const emailSortBtn = screen.getByRole("button", { name: /sort by email/i })
    fireEvent.click(emailSortBtn)
    expect(onSort).toHaveBeenCalledWith("email")
  })
})
