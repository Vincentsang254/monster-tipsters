/* eslint-disable react/prop-types */
import Loader from "@/components/common/Loader";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchTips } from "@/features/slices/tipsSlice";
import { format, parseISO } from "date-fns";

const Premium = () => {
  const userType = useSelector((state) => state.auth.userType);
  const { list: tips, status, error } = useSelector((state) => state.tips);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchTips());
  }, [dispatch]);

  const handleNavigate = (planId) => navigate(`/user/payment/${planId}`);



  // i have "vip" user who should access "vip" tips
  const getFilteredTips = () => {
    if (!Array.isArray(tips)) return [];
    return tips.filter((tip) => {
      if (!tip?.tipsType) return false;
      if (userType === "admin") return tip.tipsType === "vip";
      if (["vip"].includes(userType)) {
        return tip.tipsType === "vip";
      }
      return false;
    });
  };

  const filteredTips = getFilteredTips();

  if (status === "pending") return <Loader />;

  if (status === "rejected") {
    return (
      <div className="max-w-md p-6 mx-auto my-8 text-center text-red-600 shadow-sm bg-red-50 rounded-xl">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mx-auto mb-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-xl font-semibold">Error Loading Tips</h3>
        <p className="mt-2 text-red-500">{error}</p>
        <button 
          onClick={() => dispatch(fetchTips())}
          className="px-4 py-2 mt-4 text-white transition-colors bg-red-500 rounded-md hover:bg-red-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="container p-4 mx-auto my-6 md:p-6">
        {userType === "client" ? (
          <div className="max-w-5xl mx-auto text-center">
            <div className="p-6 mb-8 shadow-lg bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl">
              <h2 className="mb-2 text-2xl font-bold text-white md:text-3xl">Upgrade to VIP Tips</h2>
              <p className="text-indigo-100">Get access to premium predictions with higher accuracy</p>
            </div>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {PLANS.map((plan) => (
                <PlanCard
                  key={plan.planId}
                  {...plan}
                  handleNavigate={handleNavigate}
                />
              ))}
            </div>
            
            <div className="max-w-2xl p-6 mx-auto mt-8 bg-white shadow-sm rounded-xl">
              <h3 className="mb-3 text-lg font-semibold text-gray-800">Why Upgrade?</h3>
              <ul className="space-y-2 text-left text-gray-600">
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Higher accuracy predictions
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Early access to tips
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Detailed match analysis
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto">
            <div className="p-6 mb-6 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl">
              <h2 className="text-2xl font-bold text-white">VIP Tips Dashboard</h2>
              <p className="text-blue-100">Welcome to your exclusive tips portal</p>
            </div>
            
            {filteredTips.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-12 p-3 text-sm font-medium text-gray-500 bg-gray-100 rounded-lg">
                  <div className="col-span-5 md:col-span-4">Match</div>
                  <div className="col-span-3 md:col-span-2">Prediction</div>
                  <div className="col-span-2 text-center">Odds</div>
                  <div className="col-span-2 text-center">Result</div>
                  <div className="col-span-3 text-right md:col-span-2">Date</div>
                </div>
                
                {filteredTips.map((tip) => {
                  const date = parseISO(tip?.date);
                  const formattedDate = format(date, "MMM dd");
                  const formattedTime = format(date, "hh:mm a");
                  return (
                    <div key={tip?.id} className="grid grid-cols-12 p-4 transition bg-white rounded-lg shadow-sm hover:shadow-md">
                      <div className="col-span-5 md:col-span-4">
                        <div className="font-medium">{tip?.match}</div>
                        <div className="text-sm text-gray-500">{tip?.league}</div>
                      </div>
                      <div className="col-span-3 font-semibold text-blue-600 md:col-span-2">
                        {tip?.prediction}
                      </div>
                      <div className="col-span-2 font-medium text-center">
                        {tip?.odds}
                      </div>
                      <div className="col-span-2 text-center">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          tip?.results === "won" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                        }`}>
                          {tip?.results}
                        </span>
                      </div>
                      <div className="col-span-3 text-sm text-right text-gray-500 md:col-span-2">
                        <div>{formattedDate}</div>
                        <div>{formattedTime}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center bg-white shadow-sm rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-700">No tips available</h3>
                <p className="mt-1 text-gray-500">There are currently no tips matching your subscription level.</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return null;
};

const PLANS = [
  { 
    title: "Bronze Plan", 
    description: "Perfect for trying out our VIP service", 
    duration: "3 days access", 
    price: "Ksh 1",   // ✅ matches backend amount 1
    features: ["5-7 tips per day", "Basic analysis", "Email support"],
    planId: 1, 
    buttonColor: "bg-amber-600 hover:bg-amber-700",
    popular: false
  },
  { 
    title: "Silver Plan", 
    description: "Our most popular choice", 
    duration: "7 days access", 
    price: "Ksh 2",   // ✅ matches backend amount 2
    features: ["7-10 tips per day", "Detailed analysis", "Priority support"],
    planId: 2, 
    buttonColor: "bg-gray-600 hover:bg-gray-700",
    popular: true
  },
  { 
    title: "Gold Plan", 
    description: "For serious bettors", 
    duration: "30 days access", 
    price: "Ksh 3",   // ✅ matches backend amount 3
    features: ["10-15 tips per day", "Premium analysis", "24/7 support", "Personal tips on request"],
    planId: 3, 
    buttonColor: "bg-yellow-600 hover:bg-yellow-700",
    popular: false
  },
];


const PlanCard = ({ title, description, duration, price, features, planId, buttonColor, popular, handleNavigate }) => (
  <div className={`relative h-full p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 transition-all ${popular ? "ring-2 ring-blue-500" : ""}`}>
    {popular && (
      <div className="absolute top-0 right-0 px-3 py-1 text-xs font-bold text-white transform translate-x-2 -translate-y-2 bg-blue-500 rounded-full">
        POPULAR
      </div>
    )}
    <h3 className="mb-1 text-xl font-bold text-gray-800">{title}</h3>
    <p className="mb-4 text-gray-600">{description}</p>
    
    <div className="mb-6">
      <span className="text-3xl font-bold text-gray-900">{price}</span>
      <span className="text-gray-500"> / {duration}</span>
    </div>
    
    <ul className="mb-8 space-y-2 text-gray-600">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start">
          <svg className="flex-shrink-0 w-5 h-5 mt-0.5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          {feature}
        </li>
      ))}
    </ul>
    
    <button
      onClick={() => handleNavigate(planId)}
      className={`w-full px-6 py-3 font-medium text-white rounded-lg ${buttonColor} transition-colors shadow-sm hover:shadow-md`}
      aria-label={`Subscribe to ${title}`}
    >
      Get Started
    </button>
  </div>
);

export default Premium;