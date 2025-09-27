import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import moment from "moment";
import { getUserPayments } from "@/features/slices/paymentSlice";

const AdminPaymentsHistory = () => {
  const dispatch = useDispatch();
  const { list: payments = [] } = useSelector((state) => state.payments);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(getUserPayments());
  }, [dispatch]);

  useEffect(() => {
    let results = [...payments];

    if (statusFilter !== "all") {
      results = results.filter(
        (p) => p.status?.toLowerCase() === statusFilter
      );
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        (p) =>
          p.phoneNumber.includes(term) ||
          p.reference?.toLowerCase().includes(term) ||
          p.mpesaReceiptNumber?.toLowerCase().includes(term) ||
          p.checkoutRequestId?.toLowerCase().includes(term)
      );
    }

    setFilteredPayments(results);
  }, [payments, statusFilter, searchTerm]);

  const formatDate = (dateString) =>
    moment(dateString).format("MMM Do YYYY, h:mm:ss a");

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(parseFloat(amount));

  const getStatusBadge = (status) => {
    const normalizedStatus = status?.toLowerCase();
    const statusClasses = {
      success: "bg-green-100 text-green-800",
      queued: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          statusClasses[normalizedStatus] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="admin-payments-history p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Payment History
          </h1>
          <p className="text-gray-600">
            View and manage all payment transactions
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search payments..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <div className="flex items-center space-x-2">
            <label
              htmlFor="status-filter"
              className="text-sm font-medium text-gray-700"
            >
              Status:
            </label>
            <select
              id="status-filter"
              className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="success">Success</option>
              <option value="queued">Queued</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Receipt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <tr
                    key={payment.reference || payment.checkoutRequestId}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {payment.reference || payment.checkoutRequestId || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{payment.phoneNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(payment.amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(payment.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {payment.mpesaReceiptNumber || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {formatDate(payment.createdAt)}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No payments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredPayments.length > 0 && (
          <div className="px-4 py-3 bg-gray-50 border-t text-right sm:px-6">
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{filteredPayments.length}</span> of{" "}
              <span className="font-medium">{payments.length}</span> payments
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPaymentsHistory;
