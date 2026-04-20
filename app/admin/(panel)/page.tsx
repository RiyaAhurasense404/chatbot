import Link from 'next/link'
import DashboardSearch from '@/components/admin/DashboardSearch'

const cards = [
  { id: 'hero', title: 'Hero Image', description: 'Update landing page background', href: '/admin/hero', color: 'blue' },
  { id: 'categories', title: 'Categories', description: 'Manage landing page categories', href: '/admin/categories', color: 'green' },
  { id: 'banners', title: 'Banners', description: 'Manage slider banners', href: '/admin/banners', color: 'purple' },
  { id: 'catalog', title: 'Catalog', description: 'Manage nested product catalog', href: '/admin/catalog', color: 'orange' },
  { id: 'tags', title: 'Tags', description: 'Manage all product tags', href: '/admin/tags', color: 'pink' },  
  { id: 'admins', title: 'Admins', description: 'Manage admin users', href: '/admin/admins', color: 'red' },
]

const colorMap: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-500',
  green: 'bg-green-50 text-green-500',
  purple: 'bg-purple-50 text-purple-500',
  orange: 'bg-orange-50 text-orange-500',
  red: 'bg-red-50 text-red-500',
  pink: 'bg-pink-50 text-pink-500', 
}

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>
}) {
  const { search = '' } = await searchParams

  const filtered = cards.filter(
    (card) =>
      card.title.toLowerCase().includes(search.toLowerCase()) ||
      card.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-montserrat text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm font-poppins mt-1">Manage your landing page content</p>
      </div>

      <DashboardSearch defaultValue={search} />

      {search && (
        <p className="text-sm text-gray-500 font-poppins mb-4">
          {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{search}"
        </p>
      )}

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500 font-poppins text-sm">No sections found for "{search}"</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {filtered.map((card) => (
            <Link
              key={card.id}
              href={card.href}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${colorMap[card.color]}`}>
                <span className="text-lg font-bold">{card.title[0]}</span>
              </div>
              <h2 className="text-base font-semibold font-montserrat text-gray-900">{card.title}</h2>
              <p className="text-xs text-gray-500 font-poppins mt-1">{card.description}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}