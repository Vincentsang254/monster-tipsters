/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { fetchTips } from "@/features/slices/tipsSlice";
import { fetchUsers } from "@/features/slices/usersSlice";

const AdminDashboard = () => {
  const dispatch = useDispatch();

  const tips = useSelector((state) => state.tips.list);
  const users = useSelector((state) => state.users.list);

  useEffect(() => {
    dispatch(fetchTips());
    dispatch(fetchUsers());
  }, [dispatch]);

  // Count users who joined today
  const today = new Date().toISOString().split("T")[0];
  const usersJoinedToday = users.filter(
    (user) => new Date(user.createdAt).toISOString().split("T")[0] === today
  );

  // Count tips based on results
  const resultCounts = tips.reduce(
    (acc, tip) => {
      const result = tip.results?.toLowerCase(); // Normalize to lowercase
      if (result === "win") acc.win += 1;
      else if (result === "loss") acc.loss += 1;
      return acc;
    },
    { win: 0, loss: 0 }
  );

  const chartData = [
    {
      category: "Tips Results",
      Win: resultCounts.win,
      Loss: resultCounts.loss,
    },
  ];

  // Calculate win rate
  const totalTipsWithResults = resultCounts.win + resultCounts.loss;
  const winRate = totalTipsWithResults > 0 
    ? Math.round((resultCounts.win / totalTipsWithResults) * 100)
    : 0;

  return (
    <div className="p-4 md:p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500">Total Users</h2>
              <p className="text-2xl font-bold text-gray-800">{users.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-lg bg-green-50 text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500">Total Tips</h2>
              <p className="text-2xl font-bold text-gray-800">{tips.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500">Today's Users</h2>
              <p className="text-2xl font-bold text-gray-800">{usersJoinedToday.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-lg bg-amber-50 text-amber-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500">Win Rate</h2>
              <p className="text-2xl font-bold text-gray-800">{winRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stacked Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Tips Performance</h2>
            <div className="flex space-x-2">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                <span className="text-xs text-gray-500">Win</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                <span className="text-xs text-gray-500">Loss</span>
              </div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="category" tick={{ fill: '#6b7280' }} />
                <YAxis tick={{ fill: '#6b7280' }} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="Win" stackId="a" fill="#4caf50" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Loss" stackId="a" fill="#f44336" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Signups</h2>
          <div className="space-y-4">
            {usersJoinedToday.length > 0 ? (
              usersJoinedToday.slice(0, 5).map((user) => (
                <div
                  key={user.id}
                  className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex-shrink-0 bg-blue-100 text-blue-600 rounded-full p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{user.email}</p>
                    <p className="text-xs text-gray-500">
                      Joined at {new Date(user.createdAt).toLocaleTimeString()}
                      {user.phoneNumber && ` • ${user.phoneNumber}`}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="mt-2 text-sm text-gray-500">No new users today</p>
              </div>
            )}
          </div>
          {usersJoinedToday.length > 5 && (
            <div className="mt-4 text-center">
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                View all {usersJoinedToday.length} users
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Additional Stats */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Detailed Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Wins</h3>
            <p className="text-2xl font-bold text-green-600">{resultCounts.win}</p>
            <p className="text-xs text-gray-500 mt-1">
              {totalTipsWithResults > 0 ? `${Math.round((resultCounts.win / totalTipsWithResults) * 100)}% of total` : 'No data'}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Losses</h3>
            <p className="text-2xl font-bold text-red-600">{resultCounts.loss}</p>
            <p className="text-xs text-gray-500 mt-1">
              {totalTipsWithResults > 0 ? `${Math.round((resultCounts.loss / totalTipsWithResults) * 100)}% of total` : 'No data'}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Total Analyzed</h3>
            <p className="text-2xl font-bold text-blue-600">{totalTipsWithResults}</p>
            <p className="text-xs text-gray-500 mt-1">
              {tips.length > 0 ? `${Math.round((totalTipsWithResults / tips.length) * 100)}% of all tips` : 'No data'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;