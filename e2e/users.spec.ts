import { test, expect } from "@playwright/test"

test.describe("Users Administration Screen", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("1. Navigation: Navigate from side menu to Users screen", async ({ page }) => {
    // Target the link inside the sidebar navigation specifically
    const sidebar = page.locator('[data-sidebar="sidebar"]')
    const usersNavLink = sidebar.getByRole("link", { name: "Users", exact: true })
    await expect(usersNavLink).toBeVisible()
    await usersNavLink.click()

    // Assert URL and page heading
    await expect(page).toHaveURL(/\/users/)
    await expect(
      page.getByRole("heading", { name: "Users", exact: true })
    ).toBeVisible()
    await expect(
      page.getByText(/manage system users, invite team members/i)
    ).toBeVisible()
  })

  test("2. Direct URL: Direct navigation to /users loads the screen", async ({ page }) => {
    await page.goto("/users")

    await expect(page).toHaveURL(/\/users/)
    await expect(
      page.getByRole("heading", { name: "Users", exact: true })
    ).toBeVisible()
    await expect(page.getByRole("table")).toBeVisible()
    await expect(page.getByText("Aiden Becker")).toBeVisible()
  })

  test("3. Main rendering: Header, toolbar, table, and pagination are visible", async ({ page }) => {
    await page.goto("/users")
    await expect(page.getByRole("table")).toBeVisible()
    await expect(page.getByText("Aiden Becker")).toBeVisible()

    // Page title and primary action
    await expect(page.getByRole("heading", { name: "Users", exact: true })).toBeVisible()
    await expect(page.getByRole("button", { name: "Add User", exact: true })).toBeVisible()

    // Search and filters
    await expect(page.getByLabel("Search users by name or email")).toBeVisible()
    await expect(page.getByLabel("Filter by role")).toBeVisible()
    await expect(page.getByLabel("Filter by status")).toBeVisible()

    // Table headers
    await expect(page.getByRole("button", { name: /sort by user/i })).toBeVisible()
    await expect(page.getByRole("button", { name: /sort by email/i })).toBeVisible()
    await expect(page.getByRole("button", { name: /sort by role/i })).toBeVisible()
    await expect(page.getByRole("button", { name: /sort by status/i })).toBeVisible()

    // Pagination
    await expect(page.getByText(/showing/i)).toBeVisible()
    await expect(page.getByText("Page 1 of 2")).toBeVisible()
  })

  test("4. Primary workflow: Search and filter users", async ({ page }) => {
    await page.goto("/users")
    await expect(page.getByRole("table")).toBeVisible()
    await expect(page.getByText("Aiden Becker")).toBeVisible()

    // Search for a specific user
    const searchInput = page.getByLabel("Search users by name or email")
    await searchInput.fill("Marcus")

    await expect(page.getByText("Marcus Vance")).toBeVisible()
    await expect(page.getByRole("row").filter({ hasText: "Aiden Becker" })).toHaveCount(0)

    // Clear search using clear button
    const clearBtn = page.getByRole("button", { name: "Clear search" })
    await clearBtn.click()

    await expect(page.getByText("Aiden Becker")).toBeVisible()

    // Filter by role
    const roleSelect = page.getByLabel("Filter by role")
    await roleSelect.click()
    await page.getByRole("option", { name: "Admin" }).click()

    // Verify only admins are displayed
    await expect(page.getByRole("row").filter({ hasText: "Aiden Becker" })).toHaveCount(0)
    await expect(page.getByText("Elena Rostova")).toBeVisible()
    await expect(page.getByText("Marcus Vance")).toBeVisible()

    // Reset filters
    const resetBtn = page.getByRole("button", { name: "Reset", exact: true })
    await resetBtn.click()

    await expect(page.getByText("Aiden Becker")).toBeVisible()
  })

  test("5. Primary workflow: Create a new user", async ({ page }) => {
    await page.goto("/users")
    await expect(page.getByRole("table")).toBeVisible()
    await expect(page.getByText("Aiden Becker")).toBeVisible()

    // Open Add User dialog
    const addBtn = page.getByRole("button", { name: "Add User", exact: true })
    await addBtn.click()

    const dialog = page.getByRole("dialog")
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole("heading", { name: "Add New User" })).toBeVisible()

    // Fill form
    await page.getByLabel(/full name/i).fill("Benjamin Franklin")
    await page.getByLabel(/email address/i).fill("b.franklin@acme.corp")
    await page.getByRole("textbox", { name: "Department" }).fill("Invention & Research")

    // Submit form
    await page.getByRole("button", { name: "Create User" }).click()

    // Dialog closes and new user appears in the table
    await expect(dialog).not.toBeVisible()
    await expect(page.getByText("Benjamin Franklin")).toBeVisible()
    await expect(page.getByText("b.franklin@acme.corp")).toBeVisible()
  })

  test("6. Primary workflow: Edit an existing user", async ({ page }) => {
    await page.goto("/users")
    await expect(page.getByRole("table")).toBeVisible()

    // Wait for Marcus Vance row
    const userRow = page.getByRole("row").filter({ hasText: "Marcus Vance" })
    await expect(userRow).toBeVisible()

    // Open row actions dropdown
    const actionBtn = userRow.getByRole("button", { name: /open actions menu/i })
    await actionBtn.click()

    // Click Edit User
    const editItem = page.getByRole("menuitem", { name: "Edit User" })
    await editItem.click()

    // Dialog appears in Edit mode
    const dialog = page.getByRole("dialog")
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole("heading", { name: "Edit User" })).toBeVisible()

    // Update department
    const deptInput = page.getByRole("textbox", { name: "Department" })
    await deptInput.fill("Architecture Division")

    // Save changes
    await page.getByRole("button", { name: "Save Changes" }).click()
    await expect(dialog).not.toBeVisible()

    // Verify row updated
    await expect(userRow.getByText("Architecture Division")).toBeVisible()
  })

  test("7. Primary workflow: Delete a user with confirmation dialog", async ({ page }) => {
    await page.goto("/users")
    await expect(page.getByRole("table")).toBeVisible()

    const userRow = page.getByRole("row").filter({ hasText: "Aiden Becker" })
    await expect(userRow).toBeVisible()

    // Open row actions and select delete
    const actionBtn = userRow.getByRole("button", { name: /open actions menu/i })
    await actionBtn.click()

    const deleteItem = page.getByRole("menuitem", { name: "Delete User" })
    await deleteItem.click()

    // Confirmation alert dialog appears
    const alertDialog = page.getByRole("alertdialog")
    await expect(alertDialog).toBeVisible()
    await expect(
      alertDialog.getByRole("heading", { name: /delete user/i })
    ).toBeVisible()

    // Confirm deletion
    await alertDialog.getByRole("button", { name: "Delete" }).click()
    await expect(alertDialog).not.toBeVisible()

    // Verify user is removed
    await expect(page.getByRole("row").filter({ hasText: "Aiden Becker" })).toHaveCount(0)
  })

  test("8. Error state: Meaningful error message and retry action", async ({ page }) => {
    await page.goto("/users")
    await expect(page.getByRole("table")).toBeVisible()
    await expect(page.getByText("Aiden Becker")).toBeVisible()

    // Click simulated error toggle
    const testErrorBtn = page.getByRole("button", { name: "Test Error" })
    await testErrorBtn.click()

    // Alert error container appears
    const alert = page.getByRole("alert")
    await expect(alert).toBeVisible()
    await expect(alert.getByText("Something went wrong.")).toBeVisible()
    await expect(
      alert.getByText(/unable to fetch users from server/i)
    ).toBeVisible()

    // Click retry
    const retryBtn = alert.getByRole("button", { name: /try again|retry/i })
    await retryBtn.click()

    // Error disappears and table restores
    await expect(alert).not.toBeVisible()
    await expect(page.getByRole("table")).toBeVisible()
    await expect(page.getByText("Marcus Vance")).toBeVisible()
  })

  test("9. Empty state: Shows empty presentation when no records match", async ({ page }) => {
    await page.goto("/users")
    await expect(page.getByRole("table")).toBeVisible()
    await expect(page.getByText("Marcus Vance")).toBeVisible()

    // Filter by query that matches nothing
    const searchInput = page.getByLabel("Search users by name or email")
    await searchInput.fill("NonExistentQuery_98765")

    await expect(page.getByText("No users found")).toBeVisible()
    await expect(
      page.getByText(/try adjusting your search or filters/i)
    ).toBeVisible()

    // Reset via empty state button
    const resetFiltersBtn = page.getByRole("button", { name: "Reset Filters" })
    await resetFiltersBtn.click()

    await expect(page.getByText("Marcus Vance")).toBeVisible()
  })

  test("10. Responsive design: Screen remains usable at mobile viewport", async ({ page }) => {
    // Set viewport to mobile iPhone size
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto("/users")

    // Wait for hydration
    await expect(page.getByRole("table")).toBeVisible()
    await expect(page.getByText("Aiden Becker")).toBeVisible()

    // Page title and primary controls are visible
    await expect(page.getByRole("heading", { name: "Users", exact: true })).toBeVisible()
    await expect(page.getByRole("button", { name: "Add User", exact: true })).toBeVisible()

    // Sidebar trigger is accessible and toggles mobile drawer
    const sidebarToggle = page.getByLabel("Toggle sidebar navigation")
    await expect(sidebarToggle).toBeVisible()
    await sidebarToggle.click()

    // Mobile sheet opens with navigation links
    const mobileSheet = page.getByRole("dialog")
    await expect(mobileSheet).toBeVisible()
    await expect(mobileSheet.getByRole("link", { name: "Dashboard" })).toBeVisible()

    // Close drawer / navigate to dashboard
    await mobileSheet.getByRole("link", { name: "Dashboard" }).click()
    await expect(page).toHaveURL("/")
  })
})
