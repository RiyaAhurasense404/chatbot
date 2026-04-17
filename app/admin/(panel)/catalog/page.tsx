import Link from "next/link";
import { getRootCategories } from "@/lib/db/admin/catalog";
import DeleteCatalogCategoryButton from "@/components/admin/catalog/DeleteCatalogCategoryButton";

export default async function CatalogPage() {
  const categories = await getRootCategories();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-montserrat text-gray-900">
            Catalog
          </h1>
          <p className="text-gray-500 text-sm font-poppins mt-1">
            Manage your product catalog categories
          </p>
        </div>
        <Link
          href="/admin/catalog/new"
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors font-poppins inline-flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Category
        </Link>
      </div>

      {categories.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500 font-poppins">No categories yet</p>
          <Link
            href="/admin/catalog/new"
            className="text-blue-500 text-sm font-poppins mt-2 inline-block hover:underline"
          >
            Add your first category
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 font-poppins uppercase">
                  Name
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 font-poppins uppercase">
                  Created
                </th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 font-poppins uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((category) => (
                <tr
                  key={category.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/catalog/${category.id}`}
                      className="text-sm font-medium text-gray-900 font-poppins hover:text-blue-500 transition-colors inline-flex items-center gap-2"
                    >
                      {category.name}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </td>

                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-500 font-poppins">
                      {new Date(category.created_at).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/catalog/${category.id}/new`}
                        className="text-orange-700 hover:text-green-600 text-sm font-poppins"
                      >
                        + Add Sub
                      </Link>
                      <Link
                        href={`/admin/catalog/${category.id}/edit`}
                        className="text-blue-500 hover:text-blue-600 text-sm font-poppins"
                      >
                        Edit
                      </Link>
                      <DeleteCatalogCategoryButton
                        id={category.id}
                        name={category.name}
                        returnPath="/admin/catalog"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
