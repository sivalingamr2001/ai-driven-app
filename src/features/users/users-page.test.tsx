import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it } from "vitest"
import { UsersPage } from "./users-page"
import { usersApi } from "./services/users-api"

describe("UsersPage integration", () => {
  beforeEach(() => {
    usersApi.resetStore()
    usersApi.setArtificialDelay(0)
  })

  it("renders page title, description, actions and loaded users", async () => {
    render(<UsersPage />)

    expect(screen.getByRole("heading", { name: "Users" })).toBeInTheDocument()
    expect(
      screen.getByText(/manage system users, invite team members/i)
    ).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /add user/i })).toBeInTheDocument()

    // Page 1 contains Aiden Becker and Marcus Vance
    await waitFor(() => {
      expect(screen.getByText("Aiden Becker")).toBeInTheDocument()
    })
    expect(screen.getByText("Marcus Vance")).toBeInTheDocument()
    expect(screen.getByText(/showing/i)).toBeInTheDocument()
    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument()
  })

  it("searches and filters users", async () => {
    const user = userEvent.setup()
    render(<UsersPage />)

    await waitFor(() => {
      expect(screen.getByText("Aiden Becker")).toBeInTheDocument()
    })

    const searchInput = screen.getByLabelText(/search users by name/i)
    fireEvent.change(searchInput, { target: { value: "Sarah" } })

    await waitFor(() => {
      expect(screen.getByText("Sarah Chen")).toBeInTheDocument()
      expect(screen.queryByText("Aiden Becker")).not.toBeInTheDocument()
    })

    // Reset filters
    const resetBtn = screen.getByRole("button", { name: "Reset" })
    await user.click(resetBtn)

    await waitFor(() => {
      expect(screen.getByText("Aiden Becker")).toBeInTheDocument()
    })
  })

  it("creates a new user and displays them in the table", async () => {
    const user = userEvent.setup()
    render(<UsersPage />)

    await waitFor(() => {
      expect(screen.getByText("Aiden Becker")).toBeInTheDocument()
    })

    const addBtn = screen.getByRole("button", { name: /add user/i })
    await user.click(addBtn)

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Add New User" })).toBeInTheDocument()
    })

    const nameInput = screen.getByLabelText(/full name/i)
    const emailInput = screen.getByLabelText(/email address/i)
    fireEvent.change(nameInput, { target: { value: "Aaron Finch" } })
    fireEvent.change(emailInput, { target: { value: "aaron.finch@acme.corp" } })

    const submitBtn = screen.getByRole("button", { name: "Create User" })
    await user.click(submitBtn)

    await waitFor(() => {
      expect(screen.getByText("Aaron Finch")).toBeInTheDocument()
      expect(screen.getByText("aaron.finch@acme.corp")).toBeInTheDocument()
    })
  })

  it("handles error state and recovery", async () => {
    const user = userEvent.setup()
    render(<UsersPage />)

    await waitFor(() => {
      expect(screen.getByText("Aiden Becker")).toBeInTheDocument()
    })

    const testErrorBtn = screen.getByRole("button", { name: /test error/i })
    await user.click(testErrorBtn)

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument()
      expect(screen.getByText("Something went wrong.")).toBeInTheDocument()
    })

    const retryBtn = screen.getByRole("button", { name: /retry loading users/i })
    await user.click(retryBtn)

    await waitFor(() => {
      expect(screen.getByText("Aiden Becker")).toBeInTheDocument()
    })
  })
})
