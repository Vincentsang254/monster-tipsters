/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import Loader from "@/components/common/Loader";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchTips } from "@/features/slices/tipsSlice";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import { 
  Crown, 
  Star, 
  Check, 
  TrendingUp, 
  Shield, 
  Clock, 
  Zap,
  Target,
  BarChart3,
  Users,
  Award,
  Calendar
} from "lucide-react";

const Premium = () => {
  const userType = useSelector((state) => state.auth.userType);
  const { list: tips, status, error } = useSelector((state) => state.tips);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchTips());
  }, [dispatch]);

  const handleNavigate = (planId) => navigate(`/user/payment/${planId}`);

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container px-4 py-16 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md p-8 mx-auto text-center bg-white rounded-2xl shadow-xl dark:bg-gray-800"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
              <Shield className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Connection Error
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error || "Unable to load tips at the moment"}
            </p>
            <button 
              onClick={() => dispatch(fetchTips())}
              className="px-6 py-3 text-white transition-all bg-gradient-to-r from-red-500 to-red-600 rounded-xl hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl"
            >
              Try Again
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container px-4 py-8 mx-auto">
          {userType === "client" ? (
            <div className="max-w-7xl mx-auto">
              {/* Hero Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
              >
                <div className="inline-flex items-center px-4 py-2 mb-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium">
                  <Crown className="w-4 h-4 mr-2" />
                  PREMIUM PREDICTIONS
                </div>
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 dark:from-white dark:to-blue-400 bg-clip-text text-transparent mb-6">
                  Elevate Your Betting Game
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                  Join thousands of successful bettors with our data-driven VIP predictions. 
                  Higher accuracy, better odds, proven results.
                </p>
              </motion.div>

              {/* Stats Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
              >
                <div className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 text-green-500" />
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">85%+</div>
                  <div className="text-gray-600 dark:text-gray-400">Win Rate</div>
                </div>
                <div className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg text-center">
                  <Users className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">10K+</div>
                  <div className="text-gray-600 dark:text-gray-400">Active Members</div>
                </div>
                <div className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg text-center">
                  <Award className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">92%</div>
                  <div className="text-gray-600 dark:text-gray-400">Satisfaction Rate</div>
                </div>
              </motion.div>

              {/* Pricing Plans */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-20"
              >
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    Choose Your Plan
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Flexible options for every type of bettor
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {PLANS.map((plan, index) => (
                    <PlanCard
                      key={plan.planId}
                      {...plan}
                      index={index}
                      handleNavigate={handleNavigate}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Features Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 mb-16"
              >
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Why Choose VIP?
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Everything you need to make informed betting decisions
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {FEATURES.map((feature, index) => (
                    <div key={index} className="text-center p-6">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl ${feature.color} flex items-center justify-center`}>
                        <feature.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          ) : (
            /* VIP User Dashboard */
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <div className="p-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-3xl md:text-4xl font-bold mb-2">
                        VIP Tips Dashboard
                      </h1>
                      <p className="text-blue-100 text-lg">
                        Welcome to your exclusive predictions portal
                      </p>
                    </div>
                    <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-white/20 rounded-full">
                      <Crown className="w-6 h-6" />
                      <span className="font-semibold">VIP MEMBER</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {filteredTips.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden"
                >
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Today's Predictions
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      {filteredTips.length} premium tips available
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-700/50">
                        <tr>
                          <th className="px-6 py-4 text-left font-semibold text-gray-700 dark:text-gray-300">
                            Match & League
                          </th>
                          <th className="px-6 py-4 text-left font-semibold text-gray-700 dark:text-gray-300">
                            Prediction
                          </th>
                          <th className="px-6 py-4 text-center font-semibold text-gray-700 dark:text-gray-300">
                            Odds
                          </th>
                          <th className="px-6 py-4 text-center font-semibold text-gray-700 dark:text-gray-300">
                            Status
                          </th>
                          <th className="px-6 py-4 text-right font-semibold text-gray-700 dark:text-gray-300">
                            Date & Time
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredTips.map((tip) => {
                          const date = parseISO(tip?.date);
                          const formattedDate = format(date, "MMM dd, yyyy");
                          const formattedTime = format(date, "hh:mm a");
                          
                          return (
                            <motion.tr
                              key={tip?.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                            >
                              <td className="px-6 py-4">
                                <div className="font-semibold text-gray-900 dark:text-white">
                                  {tip?.match}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {tip?.league}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                                  {tip?.prediction}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                                  {tip?.odds}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                  tip?.results === "won" 
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                                    : tip?.results === "lost"
                                    ? "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
                                    : "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300"
                                }`}>
                                  {tip?.results === "won" ? (
                                    <Check className="w-4 h-4 mr-1" />
                                  ) : tip?.results === "lost" ? (
                                    <Zap className="w-4 h-4 mr-1" />
                                  ) : (
                                    <Clock className="w-4 h-4 mr-1" />
                                  )}
                                  {tip?.results || "Pending"}
                                </span>
                              </td>
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
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16"
                >
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                    <Target className="w-12 h-12 text-blue-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    No Tips Available
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
                    There are currently no VIP tips available. Check back later for new predictions.
                  </p>
                </motion.div>
              )}
            </div>
          )}
        </div>
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
    price: "Ksh 499",
    originalPrice: "799",
    features: ["5-7 tips per day", "Basic analysis", "Email support", "Mobile access"],
    planId: 499, 
    popular: false,
    color: "from-amber-500 to-orange-500"
  },
  { 
    title: "Silver Plan", 
    description: "Our most popular choice", 
    duration: "7 days access", 
    price: "Ksh 1,499",  
    originalPrice: "2,199",
    features: ["7-10 tips per day", "Detailed analysis", "Priority support", "Stats dashboard"],
    planId: 1499,
    popular: true,
    color: "from-gray-600 to-gray-700"
  },
  { 
    title: "Gold Plan", 
    description: "For serious bettors", 
    duration: "30 days access", 
    price: "Ksh 2,499",  
    originalPrice: "3,999",
    features: ["10-15 tips per day", "Premium analysis", "24/7 support", "Personal tips on request", "Advanced analytics"],
    planId: 2499,
    popular: false,
    color: "from-yellow-500 to-amber-500"
  },
];

const FEATURES = [
  {
    icon: TrendingUp,
    title: "High Accuracy",
    description: "85%+ win rate with proven track record",
    color: "bg-gradient-to-r from-green-500 to-emerald-600"
  },
  {
    icon: BarChart3,
    title: "Deep Analysis",
    description: "Comprehensive match statistics and insights",
    color: "bg-gradient-to-r from-blue-500 to-blue-600"
  },
  {
    icon: Zap,
    title: "Fast Updates",
    description: "Real-time tips and instant notifications",
    color: "bg-gradient-to-r from-purple-500 to-purple-600"
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Trusted by thousands of bettors",
    color: "bg-gradient-to-r from-indigo-500 to-indigo-600"
  }
];

const PlanCard = ({ title, description, duration, price, originalPrice, features, planId, popular, color, index, handleNavigate }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className={`relative h-full p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 transition-all hover:shadow-xl ${
      popular 
        ? "border-blue-500 scale-105" 
        : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
    }`}
  >
    {popular && (
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="px-6 py-2 text-sm font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg">
          MOST POPULAR
        </div>
      </div>
    )}

    <div className="text-center mb-6">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>

    <div className="text-center mb-6">
      <div className="flex items-center justify-center gap-2 mb-2">
        <span className="text-4xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${color}">
          {price}
        </span>
        {originalPrice && (
          <span className="text-lg text-gray-500 line-through">{originalPrice}</span>
        )}
      </div>
      <div className="text-gray-500 dark:text-gray-400">{duration}</div>
    </div>

    <ul className="space-y-3 mb-8">
      {features.map((feature, idx) => (
        <li key={idx} className="flex items-center">
          <Check className="w-5 h-5 mr-3 text-green-500 flex-shrink-0" />
          <span className="text-gray-700 dark:text-gray-300">{feature}</span>
        </li>
      ))}
    </ul>

    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => handleNavigate(planId)}
      className={`w-full py-4 px-6 font-bold text-white rounded-xl bg-gradient-to-r ${color} shadow-lg hover:shadow-xl transition-all`}
    >
      Get Started
    </motion.button>
  </motion.div>
);

export default Premium;