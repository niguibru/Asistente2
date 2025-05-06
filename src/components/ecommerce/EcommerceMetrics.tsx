
export default function EcommerceMetrics() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:gap-6">
      {/* <!-- Metric Item Start --> */}

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Prompts sugeridos
            </h3>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-gray-100 p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 mt-6 text-center shadow-md shadow-gray-500/30" >
          Prompt 1...
        </div>
        <div className="rounded-2xl border border-gray-200 bg-gray-100 p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 mt-6 text-center shadow-md shadow-gray-500/30" >
          Prompt 2...
        </div>
        <div className="rounded-2xl border border-gray-200 bg-gray-100 p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 mt-6 text-center shadow-md shadow-gray-500/30" >
          Prompt 3...
        </div>
        <div className="rounded-2xl border border-gray-200 bg-gray-100 p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 mt-6 text-center shadow-md shadow-gray-500/30" >
          Prompt 4...
        </div>

      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}

      {/* <!-- Metric Item End --> */}
    </div>
  );
}
