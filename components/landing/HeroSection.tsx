import Image from "next/image";
import Link from "next/link";
import type { HeroSectionProps } from "@/types/client";

export default function HeroSection({ backgroundImageUrl }: HeroSectionProps) {
  return (
    <>
      <div className="h-10" />

      <section className="relative w-full h-[725px] overflow-hidden">
        <Image
          src={backgroundImageUrl}
          alt="Hero background"
          fill
          priority
          className="object-cover object-top"
        />

        <div className="absolute inset-0" />

        <div className="absolute inset-0 z-10">
          <h1 className="absolute top-[100px] left-8 text-white text-[70px] font-bold leading-tight">
            Pure Goodness <br />
            from <span className="text-blue-500">Farm to Table</span>
          </h1>

          <p className="absolute top-[280px] left-8 text-white text-[29px] px-4 leading-[3.5rem]">
            Bringing you premium, naturally sourced <br />
            grains, pulses & spices processed with care.
          </p>

          <div className="absolute top-[450px] left-10 flex items-center gap-12 px-4 x-4 ">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span className="text-white text-base">Premium Quality</span>
            </div>

            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 2C6 2 3 8 3 12c0 4 2.5 7 6 8.5V22h6v-1.5C18.5 19 21 16 21 12c0-4-3-10-9-10z"
                  />
                </svg>
              </div>
              <span className="text-white text-base">Naturally Processed</span>
            </div>

            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
              <span className="text-white text-base">Farm Fresh</span>
            </div>
          </div>

          <div className="absolute top-[590px] left-44">
            <Link
              href="#categories"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 h-12 w-44 rounded-md text-3xl font-medium transition-colors inline-flex items-center gap-2"
            >
              Explore
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
