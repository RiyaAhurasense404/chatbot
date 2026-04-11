import { Category } from '@/types'

interface CategoryCardProps {
  category: Category
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <div className="relative w-full h-full rounded-xl cursor-pointer group overflow-hidden">

      <img
        src={category.image_url}
        alt={category.name}
        className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/10 to-transparent transition-all duration-300 group-hover:from-black/80" />

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-white font-bold font-montserrat text-2xl text-center transition-transform duration-300 group-hover:-translate-y-1">
          {category.name}
        </h3>
      </div>

    </div>
  )
}