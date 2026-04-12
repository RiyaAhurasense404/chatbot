export async function loginAdmin(
    username: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
  
      const data = await response.json()
  
      if (!response.ok) {
        return { success: false, error: data.error || 'Login failed' }
      }
  
      return { success: true }
  
    } catch {
      return { success: false, error: 'Something went wrong. Please try again.' }
    }
  }
  
  export async function logoutAdmin(): Promise<void> {
    await fetch('/api/admin/logout', { method: 'POST' })
  }