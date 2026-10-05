import type {
  CreateUserInput,
  PaginatedUsersResponse,
  UpdateUserInput,
  User,
  UsersQueryParams,
} from "../types"

// Initial enterprise users dataset
const INITIAL_USERS: User[] = [
  {
    id: "usr-001",
    name: "Sarah Chen",
    email: "sarah.chen@acme.corp",
    role: "owner",
    status: "active",
    department: "Executive",
    lastActive: "2 minutes ago",
    createdAt: "2024-01-15T09:00:00Z",
  },
  {
    id: "usr-002",
    name: "Marcus Vance",
    email: "marcus.vance@acme.corp",
    role: "admin",
    status: "active",
    department: "Engineering",
    lastActive: "15 minutes ago",
    createdAt: "2024-02-01T10:30:00Z",
  },
  {
    id: "usr-003",
    name: "Elena Rostova",
    email: "elena.rostova@acme.corp",
    role: "admin",
    status: "active",
    department: "Product",
    lastActive: "1 hour ago",
    createdAt: "2024-02-18T14:15:00Z",
  },
  {
    id: "usr-004",
    name: "Devon Thorne",
    email: "devon.thorne@acme.corp",
    role: "editor",
    status: "pending",
    department: "Design",
    lastActive: "Never",
    createdAt: "2024-03-05T11:00:00Z",
  },
  {
    id: "usr-005",
    name: "Amara Diallo",
    email: "amara.diallo@acme.corp",
    role: "member",
    status: "active",
    department: "Operations",
    lastActive: "3 hours ago",
    createdAt: "2024-03-12T08:45:00Z",
  },
  {
    id: "usr-006",
    name: "Liam O'Connor",
    email: "liam.oconnor@acme.corp",
    role: "editor",
    status: "inactive",
    department: "Marketing",
    lastActive: "5 days ago",
    createdAt: "2024-03-20T16:20:00Z",
  },
  {
    id: "usr-007",
    name: "Priya Sharma",
    email: "priya.sharma@acme.corp",
    role: "admin",
    status: "active",
    department: "Engineering",
    lastActive: "Just now",
    createdAt: "2024-04-02T13:10:00Z",
  },
  {
    id: "usr-008",
    name: "Kaito Tanaka",
    email: "kaito.tanaka@acme.corp",
    role: "member",
    status: "suspended",
    department: "Security",
    lastActive: "2 weeks ago",
    createdAt: "2024-04-10T11:25:00Z",
  },
  {
    id: "usr-009",
    name: "Chloe Dubois",
    email: "chloe.dubois@acme.corp",
    role: "member",
    status: "active",
    department: "Customer Success",
    lastActive: "25 minutes ago",
    createdAt: "2024-05-01T09:15:00Z",
  },
  {
    id: "usr-010",
    name: "Lucas Silva",
    email: "lucas.silva@acme.corp",
    role: "editor",
    status: "pending",
    department: "Content",
    lastActive: "Never",
    createdAt: "2024-05-14T15:30:00Z",
  },
  {
    id: "usr-011",
    name: "Zoe Washington",
    email: "zoe.washington@acme.corp",
    role: "member",
    status: "active",
    department: "Finance",
    lastActive: "4 hours ago",
    createdAt: "2024-06-01T10:00:00Z",
  },
  {
    id: "usr-012",
    name: "Aiden Becker",
    email: "aiden.becker@acme.corp",
    role: "member",
    status: "inactive",
    department: "Sales",
    lastActive: "3 weeks ago",
    createdAt: "2024-06-18T14:40:00Z",
  },
]

// In-memory data store for the session
let usersStore: User[] = [...INITIAL_USERS]
let simulateApiError = false
let artificialDelayMs = 150

export const usersApi = {
  setSimulateError(shouldFail: boolean) {
    simulateApiError = shouldFail
  },

  setArtificialDelay(delayMs: number) {
    artificialDelayMs = delayMs
  },

  resetStore() {
    usersStore = INITIAL_USERS.map((u) => ({ ...u }))
    simulateApiError = false
  },

  async getUsers(params: UsersQueryParams = {}): Promise<PaginatedUsersResponse> {
    if (artificialDelayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, artificialDelayMs))
    }

    if (simulateApiError) {
      throw new Error("Unable to fetch users from server. Please try again.")
    }

    const {
      search = "",
      role = "all",
      status = "all",
      sortBy = "name",
      sortOrder = "asc",
      page = 1,
      pageSize = 10,
    } = params

    let filtered = [...usersStore]

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase().trim()
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.department && u.department.toLowerCase().includes(q))
      )
    }

    // Role filter
    if (role !== "all") {
      filtered = filtered.filter((u) => u.role === role)
    }

    // Status filter
    if (status !== "all") {
      filtered = filtered.filter((u) => u.status === status)
    }

    // Sorting
    filtered.sort((a, b) => {
      let valA = a[sortBy]
      let valB = b[sortBy]

      valA = valA.toLowerCase()
      valB = valB.toLowerCase()

      if (valA < valB) return sortOrder === "asc" ? -1 : 1
      if (valA > valB) return sortOrder === "asc" ? 1 : -1
      return 0
    })

    const total = filtered.length
    const totalPages = Math.ceil(total / pageSize) || 1
    const clampedPage = Math.max(1, Math.min(page, totalPages))
    const startIdx = (clampedPage - 1) * pageSize
    const paginated = filtered.slice(startIdx, startIdx + pageSize)

    return {
      data: paginated,
      total,
      page: clampedPage,
      pageSize,
      totalPages,
    }
  },

  async getUserById(id: string): Promise<User> {
    if (artificialDelayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, artificialDelayMs))
    }
    const user = usersStore.find((u) => u.id === id)
    if (!user) throw new Error(`User with ID ${id} not found.`)
    return { ...user }
  },

  async createUser(input: CreateUserInput): Promise<User> {
    if (artificialDelayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, artificialDelayMs))
    }

    if (simulateApiError) {
      throw new Error("Failed to create user. Server returned an error.")
    }

    const newUser: User = {
      id: `usr-${Date.now().toString(36)}`,
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      role: input.role,
      status: input.status,
      department: input.department?.trim() || "General",
      lastActive: "Never",
      createdAt: new Date().toISOString(),
    }

    usersStore = [newUser, ...usersStore]
    return { ...newUser }
  },

  async updateUser(id: string, input: UpdateUserInput): Promise<User> {
    if (artificialDelayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, artificialDelayMs))
    }

    if (simulateApiError) {
      throw new Error("Failed to update user. Server returned an error.")
    }

    const idx = usersStore.findIndex((u) => u.id === id)
    if (idx === -1) {
      throw new Error(`User with ID ${id} not found.`)
    }

    const updatedUser: User = {
      ...usersStore[idx],
      ...input,
      name: input.name ? input.name.trim() : usersStore[idx].name,
      email: input.email ? input.email.trim().toLowerCase() : usersStore[idx].email,
      department:
        input.department !== undefined
          ? input.department.trim()
          : usersStore[idx].department,
    }

    usersStore[idx] = updatedUser
    return { ...updatedUser }
  },

  async deleteUser(id: string): Promise<void> {
    if (artificialDelayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, artificialDelayMs))
    }

    if (simulateApiError) {
      throw new Error("Failed to delete user. Server returned an error.")
    }

    const idx = usersStore.findIndex((u) => u.id === id)
    if (idx === -1) {
      throw new Error(`User with ID ${id} not found.`)
    }

    usersStore = usersStore.filter((u) => u.id !== id)
  },

  async bulkDeleteUsers(ids: string[]): Promise<void> {
    if (artificialDelayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, artificialDelayMs))
    }

    if (simulateApiError) {
      throw new Error("Failed to delete selected users.")
    }

    const idsSet = new Set(ids)
    usersStore = usersStore.filter((u) => !idsSet.has(u.id))
  },
}
