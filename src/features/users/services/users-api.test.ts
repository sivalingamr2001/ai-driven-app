import { beforeEach, describe, expect, it } from "vitest"
import { usersApi } from "./users-api"

describe("usersApi", () => {
  beforeEach(() => {
    usersApi.resetStore()
    usersApi.setArtificialDelay(0)
  })

  it("returns initial paginated users list", async () => {
    const res = await usersApi.getUsers({ page: 1, pageSize: 10 })
    expect(res.data.length).toBe(10)
    expect(res.total).toBe(12)
    expect(res.totalPages).toBe(2)
    expect(res.page).toBe(1)
  })

  it("filters users by search query", async () => {
    const res = await usersApi.getUsers({ search: "Sarah" })
    expect(res.data.length).toBe(1)
    expect(res.data[0].name).toBe("Sarah Chen")
  })

  it("filters users by role", async () => {
    const res = await usersApi.getUsers({ role: "owner" })
    expect(res.data.every((u) => u.role === "owner")).toBe(true)
    expect(res.data.length).toBe(1)
  })

  it("filters users by status", async () => {
    const res = await usersApi.getUsers({ status: "suspended" })
    expect(res.data.every((u) => u.status === "suspended")).toBe(true)
    expect(res.data.length).toBe(1)
    expect(res.data[0].name).toBe("Kaito Tanaka")
  })

  it("creates a new user and updates store", async () => {
    const newUser = await usersApi.createUser({
      name: "Alice Montgomery",
      email: "alice@acme.corp",
      role: "admin",
      status: "active",
      department: "Legal",
    })

    expect(newUser.id).toBeDefined()
    expect(newUser.name).toBe("Alice Montgomery")
    expect(newUser.email).toBe("alice@acme.corp")

    const res = await usersApi.getUsers({ search: "Alice" })
    expect(res.data.length).toBe(1)
    expect(res.total).toBe(1)

    const all = await usersApi.getUsers()
    expect(all.total).toBe(13)
  })

  it("updates an existing user", async () => {
    const updated = await usersApi.updateUser("usr-001", {
      name: "Sarah Chen-Wu",
      department: "Board of Directors",
    })

    expect(updated.name).toBe("Sarah Chen-Wu")
    expect(updated.department).toBe("Board of Directors")

    const fetched = await usersApi.getUserById("usr-001")
    expect(fetched.name).toBe("Sarah Chen-Wu")
  })

  it("deletes a user from store", async () => {
    await usersApi.deleteUser("usr-002")

    await expect(usersApi.getUserById("usr-002")).rejects.toThrow("not found")
    const res = await usersApi.getUsers()
    expect(res.total).toBe(11)
  })

  it("bulk deletes users from store", async () => {
    await usersApi.bulkDeleteUsers(["usr-003", "usr-004"])
    const res = await usersApi.getUsers()
    expect(res.total).toBe(10)
  })

  it("simulates error when simulateApiError is active", async () => {
    usersApi.setSimulateError(true)
    await expect(usersApi.getUsers()).rejects.toThrow(
      "Unable to fetch users from server"
    )
  })
})
