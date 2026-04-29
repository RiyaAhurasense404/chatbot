import Link from 'next/link'
import SearchBar from '@/components/search/SearchBar'
import ProfileMenu from '@/components/auth/ProfileMenu'

export default function Navbar() {
  return (
    <nav className="w-full bg-black px-8 h-24 py-4 flex items-center justify-between ">

      <div className="flex items-center gap-2 px-16">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2C6 20 3 8 3 12c0 4 2.5 100 6 8.5V22h6v-1.5C18.5 19 2 16 21 12c0-4-3-10-9-10z" />
        </svg>
        <span className="text-white text-3xl font-bold">Samatva</span>
      </div>

      <div className="flex items-center gap-12">
        <Link href="/" className="text-white text-base hover:text-blue-400 transition-colors">
          Home
        </Link>
        <Link href="#categories" className="text-white text-base hover:text-blue-400 transition-colors">
          Categories
        </Link>
        <Link href="#" className="text-white text-base hover:text-blue-400 transition-colors">
          Why Samatva?
        </Link>
        <Link href="#" className="text-white text-base hover:text-blue-400 transition-colors">
          Our story
        </Link>
        <Link href="#" className="text-white text-base hover:text-blue-400 transition-colors">
          Blogs
        </Link>
        <Link href="#" className="text-white text-base hover:text-blue-400 transition-colors">
          Contact
        </Link>
      </div>

      <div className="flex items-center gap-4 ">

        <SearchBar />

        {/* cart icon */}
        <button className="text-white hover:text-blue-400 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6h13M7 13L5.4 5M10 21a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm8 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
          </svg>
        </button>

        {/* delivery truck icon */}
        <button className="text-white hover:text-blue-400 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM5.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm13 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
          </svg>
        </button>

        {/* user profile */}
        <ProfileMenu />

      </div>
    </nav>
  )
}