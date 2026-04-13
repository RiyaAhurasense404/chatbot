export async function createAdmin(
    username: string,
    password: string
  ): Promise<void> {
    const response = await fetch('/api/admin/admins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
  
    const data = await response.json()
  
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create admin')
    }
  }
  
  export async function deleteAdmin(id: string): Promise<void> {
    const response = await fetch(`/api/admin/admins/${id}`, {
      method: 'DELETE',
    })
  
    const data = await response.json()
  
    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete admin')
    }
  }