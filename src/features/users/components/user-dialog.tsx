import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type {
  CreateUserInput,
  UpdateUserInput,
  User,
  UserRole,
  UserStatus,
} from "../types"

interface UserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: User | null // If present, edit mode; otherwise, create mode
  onSubmit: (data: CreateUserInput | UpdateUserInput) => Promise<void>
}

export function UserDialog({
  open,
  onOpenChange,
  user,
  onSubmit,
}: UserDialogProps) {
  const isEdit = Boolean(user)

  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [department, setDepartment] = React.useState("")
  const [role, setRole] = React.useState<UserRole>("member")
  const [status, setStatus] = React.useState<UserStatus>("active")

  const [errors, setErrors] = React.useState<{ name?: string; email?: string }>({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Populate fields when user prop changes or dialog opens
  React.useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
      setDepartment(user.department || "")
      setRole(user.role)
      setStatus(user.status)
    } else {
      setName("")
      setEmail("")
      setDepartment("")
      setRole("member")
      setStatus("active")
    }
    setErrors({})
  }, [user, open])

  const validate = () => {
    const errs: { name?: string; email?: string } = {}
    if (!name.trim()) {
      errs.name = "Full name is required."
    }
    if (!email.trim()) {
      errs.email = "Email address is required."
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = "Please enter a valid email address."
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    try {
      await onSubmit({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        department: department.trim() || undefined,
        role,
        status,
      })
      onOpenChange(false)
    } catch {
      // Handled by parent or API error display
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit User" : "Add New User"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update user profile details and permissions."
              : "Create a new team member and assign their role."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="user-name"
              className="text-xs font-medium text-foreground"
            >
              Full Name <span className="text-destructive">*</span>
            </label>
            <Input
              id="user-name"
              placeholder="e.g. Jane Doe"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }))
              }}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "name-error" : undefined}
              className="h-8 text-xs"
            />
            {errors.name && (
              <p id="name-error" className="text-[0.6875rem] text-destructive">
                {errors.name}
              </p>
            )}
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label
              htmlFor="user-email"
              className="text-xs font-medium text-foreground"
            >
              Email Address <span className="text-destructive">*</span>
            </label>
            <Input
              id="user-email"
              type="email"
              placeholder="e.g. jane.doe@acme.corp"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (errors.email)
                  setErrors((prev) => ({ ...prev, email: undefined }))
              }}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              className="h-8 text-xs"
            />
            {errors.email && (
              <p id="email-error" className="text-[0.6875rem] text-destructive">
                {errors.email}
              </p>
            )}
          </div>

          {/* Department */}
          <div className="space-y-1.5">
            <label
              htmlFor="user-department"
              className="text-xs font-medium text-foreground"
            >
              Department
            </label>
            <Input
              id="user-department"
              placeholder="e.g. Engineering, Design, Finance"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="h-8 text-xs"
            />
          </div>

          {/* Role and Status Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label
                htmlFor="user-role"
                className="text-xs font-medium text-foreground"
              >
                Role
              </label>
              <Select
                value={role}
                onValueChange={(val) => setRole(val as UserRole)}
              >
                <SelectTrigger id="user-role" className="h-8 text-xs w-full" aria-label="Role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="user-status"
                className="text-xs font-medium text-foreground"
              >
                Status
              </label>
              <Select
                value={status}
                onValueChange={(val) => setStatus(val as UserStatus)}
              >
                <SelectTrigger id="user-status" className="h-8 text-xs w-full" aria-label="Status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : isEdit ? "Save Changes" : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
