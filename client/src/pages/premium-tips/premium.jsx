/** @format */
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { Check, Zap, Clock } from "lucide-react";
import { fetchCodes } from "@/features/slices/codeSlice";

const Premium = () => {
  const dispatch = useDispatch();
  const { codes, loading, error } = useSelector((state) => state.codes);

  useEffect(() => {
    dispatch(fetchCodes());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-6 py-10">
      <motion.div
        className="max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          🎟 Premium Betting Codes
        </h1>

        {/* Loading state */}
        {loading ? (
          <div className="text-center py-20 text-gray-600 dark:text-gray-300">
            Loading codes...
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">
            {error}
          </div>
        ) : codes.length === 0 ? (
          <div className="text-center py-20 text-gray-600 dark:text-gray-300">
            No premium codes available yet.
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Code Type
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Results
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {codes.map((tip) => {
                  const date = parseISO(tip?.createdAt);
                  const formattedDate = format(date, "MMM dd, yyyy");
                  const formattedTime = format(date, "hh:mm a");

                  return (
                    <motion.tr
                      key={tip?.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      {/* Code */}
                      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                        {tip?.code}
                      </td>

                      {/* Code Type */}
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {tip?.codeType}
                      </td>

                      {/* Results */}
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            tip?.results === "win"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                              : tip?.results === "loss"
                              ? "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300"
                          }`}
                        >
                          {tip?.results === "win" ? (
                            <Check className="w-4 h-4 mr-1" />
                          ) : tip?.results === "loss" ? (
                            <Zap className="w-4 h-4 mr-1" />
                          ) : (
                            <Clock className="w-4 h-4 mr-1" />
                          )}
                          {tip?.results || "Pending"}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-right">
                        <div className="text-sm text-gray-900 dark:text-white font-medium">
                          {formattedDate}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {formattedTime}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Premium;
