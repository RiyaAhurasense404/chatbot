import { deleteAdmin, getAdminCount } from '@/lib/db/admin/admins'
import { handleApiError, ValidationError, DatabaseError } from '@/utils/error'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const { id } = await params

    if (!id) {
      throw new ValidationError('Admin id is required')
    }

    const count = await getAdminCount()
    if (count <= 1) {
      throw new DatabaseError('Cannot delete the last admin')
    }

    await deleteAdmin(id)

    return Response.json(
      { message: 'Admin deleted successfully' },
      { status: 200 }
    )

  } catch (error) {
    return handleApiError(error)
  }
}