export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
      <div className="h-4 w-96 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>

      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
            <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div>
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
            <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div>
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
            <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div>
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
            <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>

        <div className="mt-6">
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
          <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>

        <div className="mt-6">
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
          <div className="h-24 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>

        <div className="mt-8 flex justify-end">
          <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mr-4"></div>
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}
