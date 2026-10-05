import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { UserDialog } from "./user-dialog"
import type { User } from "../types"

const mockUser: User = {
  id: "usr-001",
  name: "Sarah Chen",
  email: "sarah.chen@acme.corp",
  role: "owner",
  status: "active",
  department: "Executive",
  lastActive: "2 hours ago",
  createdAt: "2024-01-15T09:00:00Z",
}

describe("UserDialog", () => {
  it("renders Add New User dialog with empty inputs", () => {
    render(
      <UserDialog
        open={true}
        onOpenChange={vi.fn()}
        onSubmit={vi.fn()}
      />
    )

    expect(screen.getByRole("heading", { name: "Add New User" })).toBeInTheDocument()
    expect(screen.getByLabelText(/full name/i)).toHaveValue("")
    expect(screen.getByLabelText(/email address/i)).toHaveValue("")
  })

  it("shows validation errors when submitting with empty required fields", async () => {
    const onSubmit = vi.fn()
    render(
      <UserDialog
        open={true}
        onOpenChange={vi.fn()}
        onSubmit={onSubmit}
      />
    )

    const submitBtn = screen.getByRole("button", { name: "Create User" })
    fireEvent.click(submitBtn)

    expect(screen.getByText("Full name is required.")).toBeInTheDocument()
    expect(screen.getByText("Email address is required.")).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it("submits valid data when filled properly", async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const onOpenChange = vi.fn()

    render(
      <UserDialog
        open={true}
        onOpenChange={onOpenChange}
        onSubmit={onSubmit}
      />
    )

    await user.type(screen.getByLabelText(/full name/i), "Johnathan Swift")
    await user.type(screen.getByLabelText(/email address/i), "j.swift@acme.corp")
    await user.type(screen.getByLabelText(/department/i), "Engineering")

    const submitBtn = screen.getByRole("button", { name: "Create User" })
    await user.click(submitBtn)

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Johnathan Swift",
          email: "j.swift@acme.corp",
          department: "Engineering",
        })
      )
    })
  })

  it("pre-populates inputs in Edit mode", () => {
    render(
      <UserDialog
        open={true}
        onOpenChange={vi.fn()}
        user={mockUser}
        onSubmit={vi.fn()}
      />
    )

    expect(screen.getByRole("heading", { name: "Edit User" })).toBeInTheDocument()
    expect(screen.getByLabelText(/full name/i)).toHaveValue("Sarah Chen")
    expect(screen.getByLabelText(/email address/i)).toHaveValue("sarah.chen@acme.corp")
    expect(screen.getByLabelText(/department/i)).toHaveValue("Executive")
    expect(screen.getByRole("button", { name: "Save Changes" })).toBeInTheDocument()
  })
})
