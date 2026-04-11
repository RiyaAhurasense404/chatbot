import { Category } from '@/types'
import CategoryCard from './CategoryCard'

interface CategoriesSectionProps {
  categories: Category[]
}

export default function CategoriesSection({ categories }: CategoriesSectionProps) {
  const largeCards = categories.filter((c) => c.size === 'large')
  const smallCards = categories.filter((c) => c.size === 'small')

  return (
    <section id="categories" className="w-full bg-[#f5f0e8] px-12 py-12">

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-5xl font-bold font-montserrat text-gray-900">
          Explore our{' '}
          <span className="text-blue-500">range</span>
        </h2>

        <button className="bg-gradient-to-r from-blue-700 to-blue-500 hover:bg-blue-600 transition-colors text-white text-lg font-medium px-6 py-2.5 rounded-md inline-flex items-center gap-2">
          View All Categories
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>

      <div className="flex gap-8 mb-8 h-[650px] overflow-hidden">

        <div className="flex-[2] h-full overflow-hidden">
          {largeCards[0] && <CategoryCard category={largeCards[0]} />}
        </div>

        <div className="flex flex-col flex-1 gap-8 h-full overflow-hidden">
          <div className="flex-1 overflow-hidden">
            {largeCards[1] && <CategoryCard category={largeCards[1]} />}
          </div>
          <div className="flex-1 overflow-hidden">
            {largeCards[2] && <CategoryCard category={largeCards[2]} />}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-8 h-[220px] overflow-hidden">
        {smallCards.map((category) => (
          <div key={category.id} className="h-full overflow-hidden">
            <CategoryCard category={category} />
          </div>
        ))}
      </div>

    </section>
  )
}