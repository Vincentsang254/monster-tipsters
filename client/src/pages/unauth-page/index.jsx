/* eslint-disable react/no-unescaped-entities */
import { useNavigate } from "react-router-dom";

function UnauthPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-lg shadow-md text-center">
        <div className="flex justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Access Denied
        </h2>
        <p className="mt-2 text-gray-600">
          You don't have permission to view this page. Please contact your
          administrator or sign in with an authorized account.
        </p>
        <div className="mt-6">
          <button
            onClick={() => navigate("/")}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Return to Home Page
          </button>
        </div>
        <div className="mt-4">
          <button
            onClick={() => navigate("/login")}
            className="text-sm text-blue-600 hover:text-blue-500 font-medium"
          >
            Or sign in to a different account
          </button>
        </div>
      </div>
    </div>
  );
}

export default UnauthPage;