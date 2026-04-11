import Link from 'next/link'

export default function ChatCTASection() {
  return (
    <section className="w-full bg-black py-24 flex flex-col items-center justify-center gap-8">

      <h2 className="text-white text-5xl font-bold font-montserrat text-center">
        Have a question about <br />
        <span className="text-blue-400">our products?</span>
      </h2>

      <p className="text-gray-400 text-center text-lg font-poppins max-w-xl">
        Our AI food assistant is here to help you find the perfect ingredients, recipes and more.
      </p>

      <Link
        href="/chat-with-us"
        className="bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold px-12 py-4 rounded-md transition-colors inline-flex items-center gap-3 font-poppins"
      >
        Chat with Flavor
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </Link>

    </section>
  )
}