/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
/** @format */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { format, parseISO, isValid } from "date-fns";
import { toast } from "react-toastify";
import { 
  Check, 
  Zap, 
  Clock, 
  Copy, 
  Crown, 
  Filter, 
  Search, 
  TrendingUp, 
  Users, 
  Award, 
  Star,
  Shield,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Calendar,
  Target,
  BarChart3,
  Rocket,
  Gem,
  Clock4,
  Infinity,
  AlertCircle
} from "lucide-react";
import { fetchCodes } from "@/features/slices/codeSlice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Premium = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: codes, status, error } = useSelector((state) => state.codes || {});
  const { userType } = useSelector((state) => state.auth || {});
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [copiedCodeId, setCopiedCodeId] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    if (userType === "premium") {
      dispatch(fetchCodes());
    }
  }, [dispatch, userType]);

  // Safe array access with fallback
  const safeCodes = Array.isArray(codes) ? codes : [];

  const filteredCodes = safeCodes?.filter((code) => {
    // Null-safe property access
    const codeValue = code?.code || "";
    const codeTypeValue = code?.codeType || "";
    const resultsValue = code?.results || "";

    const matchesSearch = 
      codeValue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      codeTypeValue.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = 
      activeFilter === "all" ? true :
      activeFilter === "win" ? resultsValue === "win" :
      activeFilter === "loss" ? resultsValue === "loss" :
      activeFilter === "pending" ? !resultsValue : true;

    return matchesSearch && matchesFilter;
  });

  const copyToClipboard = async (code, codeId) => {
    if (!code) {
      toast.error("No code available to copy", { position: "top-center" });
      return;
    }

    try {
      await navigator.clipboard.writeText(code);
      setCopiedCodeId(codeId);
      
      toast.success("Code copied to clipboard!", {
        position: "top-center",
        autoClose: 2000,
      });
      
      setTimeout(() => setCopiedCodeId(null), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
      toast.error("Failed to copy code. Please try again.", {
        position: "top-center",
      });
    }
  };

  // Safe date formatting function
  const safeFormatDate = (dateString) => {
    if (!dateString) return { date: "N/A", time: "" };
    
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) return { date: "Invalid Date", time: "" };
      
      return {
        date: format(date, "MMM dd, yyyy"),
        time: format(date, "hh:mm a")
      };
    } catch (error) {
      console.error("Date formatting error:", error);
      return { date: "Invalid Date", time: "" };
    }
  };

  // Handle payment navigation - UPDATED PATH
  const handlePayment = (amount) => {
    if (!amount || isNaN(amount)) {
      toast.error("Invalid payment amount", { position: "top-center" });
      return;
    }
    navigate(`/user/payment/${amount}`);
  };

  // Calculate stats with null safety
  const totalCodes = safeCodes.length || 0;
  const winCodes = safeCodes.filter(code => code?.results === "win").length || 0;
  const winRate = totalCodes > 0 ? Math.round((winCodes / totalCodes) * 100) : 0;

  const StatCard = ({ icon: Icon, title, value, description, color, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-105">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                {title || "Statistic"}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {value || "0"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {description || "No description"}
              </p>
            </div>
            <div className={`p-3 rounded-xl ${color || "bg-gray-500"} group-hover:scale-110 transition-transform duration-300`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  // Pricing plans for client users
  const pricingPlans = [
    {
      name: "Starter",
      price: "Kshs 499",
      amount: "499",
      period: "3 days",
      description: "Perfect for beginners",
      popular: false,
      features: [
        "10 Premium Codes Daily",
        "75%+ Win Rate",
        "Basic Analytics",
        "24/7 Support",
        "Mobile Access"
      ],
      buttonText: "Get Started",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      name: "Pro",
      price: "Kshs 1499",
      amount: "1499",
      period: "7 days",
      description: "Most Popular Choice",
      popular: true,
      features: [
        "Unlimited Premium Codes",
        "85%+ Win Rate",
        "Advanced Analytics",
        "Priority Support",
        "Real-time Updates",
        "VIP Community Access"
      ],
      buttonText: "Go Pro",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      name: "Elite",
      price: "Kshs 2499",
      amount: "2499",
      period: "month",
      description: "For Serious Bettors",
      popular: false,
      features: [
        "Unlimited Premium Codes",
        "90%+ Win Rate",
        "Premium Analytics",
        "Dedicated Account Manager",
        "Early Access Features",
        "Custom Code Requests",
        "Exclusive Webinars"
      ],
      buttonText: "Go Elite",
      gradient: "from-amber-500 to-amber-600"
    }
  ];

  // Features list for client users
  const features = [
    {
      icon: Target,
      title: "High Accuracy",
      description: "85%+ win rate across all premium codes"
    },
    {
      icon: Zap,
      title: "Real-time Updates",
      description: "Instant access to new codes as they're generated"
    },
    {
      icon: Shield,
      title: "Verified Results",
      description: "All codes are tested and verified before release"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Detailed performance tracking and insights"
    },
    {
      icon: Users,
      title: "VIP Community",
      description: "Join our exclusive community of winning bettors"
    },
    {
      icon: Crown,
      title: "Premium Support",
      description: "24/7 dedicated support for all members"
    }
  ];

  // Safe empty state message
  const getEmptyStateMessage = (searchTerm, activeFilter) => {
    if (searchTerm) {
      return `No codes found for "${searchTerm}"`;
    }
    if (activeFilter !== "all") {
      return `No ${activeFilter} codes found`;
    }
    return "No premium codes available at the moment. Check back later!";
  };

  // Bulk copy feature
  const copyAllCodes = async () => {
    if (!filteredCodes || filteredCodes.length === 0) {
      toast.error("No codes available to copy", { position: "top-center" });
      return;
    }

    const allCodes = filteredCodes
      .map(code => code?.code)
      .filter(Boolean)
      .join('\n');

    if (!allCodes) {
      toast.error("No valid codes to copy", { position: "top-center" });
      return;
    }

    try {
      await navigator.clipboard.writeText(allCodes);
      toast.success("All codes copied to clipboard!", {
        position: "top-center",
      });
    } catch (err) {
      toast.error("Failed to copy codes", {
        position: "top-center",
      });
    }
  };

  // Safe user type check
  const isClientUser = userType === "client";
  const isPremiumUser = userType === "premium";

  if (isClientUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container px-4 py-8 mx-auto max-w-7xl">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16 pt-8"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center px-6 py-3 mb-6 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-semibold shadow-lg"
            >
              <Crown className="w-4 h-4 mr-2" />
              UNLOCK PREMIUM FEATURES
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-amber-600 to-orange-600 dark:from-white dark:via-amber-400 dark:to-orange-400 bg-clip-text text-transparent mb-6">
              Upgrade to Premium
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Join thousands of successful bettors who are already using our premium codes to maximize their winnings
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature?.title || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group h-full">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      {feature?.icon ? (
                        <feature.icon className="w-6 h-6 text-white" />
                      ) : (
                        <Star className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {feature?.title || "Feature"}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {feature?.description || "No description available"}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Pricing Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Choose Your Plan
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Start with a 7-day free trial. No credit card required.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {pricingPlans.map((plan, index) => (
                <motion.div
                  key={plan?.name || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 * index }}
                  className="relative"
                >
                  {plan?.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 text-sm font-semibold">
                        MOST POPULAR
                      </Badge>
                    </div>
                  )}
                  
                  <Card className={`bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 h-full ${
                    plan?.popular ? 'ring-2 ring-purple-500 scale-105' : ''
                  }`}>
                    <CardHeader className="text-center pb-4">
                      <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                        {plan?.name || "Plan"}
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-400">
                        {plan?.description || "Premium plan"}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="text-center">
                      <div className="mb-6">
                        <span className="text-4xl font-bold text-gray-900 dark:text-white">
                          {plan?.price || "Kshs 0"}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">/{plan?.period || "period"}</span>
                      </div>
                      
                      <ul className="space-y-3 mb-6">
                        {(plan?.features || []).map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <CheckCircle2 className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                            {feature || "Feature"}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    
                    <CardFooter>
                      <Button
                        onClick={() => handlePayment(plan?.amount)}
                        className={`w-full py-3 text-lg font-semibold bg-gradient-to-r ${plan?.gradient || "from-gray-500 to-gray-600"} hover:shadow-xl transition-all duration-300`}
                        size="lg"
                      >
                        {plan?.buttonText || "Get Started"}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          >
            <StatCard
              icon={TrendingUp}
              title="Win Rate"
              value="85%+"
              description="Average Success Rate"
              color="bg-gradient-to-r from-emerald-500 to-emerald-600"
            />
            <StatCard
              icon={Users}
              title="Active Users"
              value="10K+"
              description="Premium Members"
              color="bg-gradient-to-r from-blue-500 to-blue-600"
            />
            <StatCard
              icon={Award}
              title="Total Winnings"
              value="$2M+"
              description="Monthly Payouts"
              color="bg-gradient-to-r from-amber-500 to-amber-600"
            />
          </motion.div>

          {/* Final CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center"
          >
            <Card className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0 shadow-2xl">
              <CardContent className="p-12 text-center">
                <h3 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to Start Winning?
                </h3>
                <p className="text-xl mb-8 text-amber-100 max-w-2xl mx-auto">
                  Join our premium community today and get access to exclusive betting codes with proven success rates.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => handlePayment("499")}
                    size="lg"
                    className="bg-white text-amber-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
                  >
                    Start Free Trial
                    <Rocket className="w-5 h-5 ml-2" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white/10 px-8 py-3 text-lg font-semibold"
                  >
                    View Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // Premium user view
  if (isPremiumUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container px-4 py-8 mx-auto max-w-7xl">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center px-6 py-3 mb-6 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-semibold shadow-lg">
              <Crown className="w-4 h-4 mr-2" />
              PREMIUM MEMBER ACCESS
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-amber-600 dark:from-white dark:to-amber-400 bg-clip-text text-transparent mb-4">
              Exclusive Betting Codes
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Welcome back! Here are your latest premium codes with real-time updates
            </p>
          </motion.div>

          {/* Stats Overview */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <StatCard
              icon={TrendingUp}
              title="Win Rate"
              value={`${winRate}%`}
              description="Current Success Rate"
              color="bg-gradient-to-r from-emerald-500 to-emerald-600"
              delay={0.1}
            />
            <StatCard
              icon={Award}
              title="Total Codes"
              value={totalCodes.toString()}
              description="Premium Codes Available"
              color="bg-gradient-to-r from-amber-500 to-amber-600"
              delay={0.2}
            />
            <StatCard
              icon={Users}
              title="Active Users"
              value="2K+"
              description="Using Our Codes"
              color="bg-gradient-to-r from-blue-500 to-blue-600"
              delay={0.3}
            />
          </motion.div>

          {/* Main Codes Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader className="pb-6 bg-gradient-to-r from-gray-50 to-amber-50 dark:from-gray-700 dark:to-amber-900/20">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div>
                      <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-amber-600 dark:from-white dark:to-amber-400 bg-clip-text text-transparent">
                        Premium Codes Dashboard
                      </CardTitle>
                      <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Copy and use these exclusive betting codes instantly
                        {lastUpdated && (
                          <span className="text-xs text-gray-500 block mt-1">
                            Last updated: {format(lastUpdated, "hh:mm a")}
                          </span>
                        )}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => dispatch(fetchCodes())}
                      disabled={status === "pending"}
                      className="flex items-center gap-2"
                    >
                      <Zap className="w-4 h-4" />
                      Refresh
                    </Button>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search codes or types..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full sm:w-64 bg-white/70 dark:bg-gray-700/70 border-gray-200 dark:border-gray-600"
                      />
                    </div>
                    
                    <Tabs value={activeFilter} onValueChange={setActiveFilter}>
                      <TabsList className="bg-gray-100 dark:bg-gray-700 p-1">
                        <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs">
                          All
                        </TabsTrigger>
                        <TabsTrigger value="win" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs">
                          Wins
                        </TabsTrigger>
                        <TabsTrigger value="loss" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs">
                          Losses
                        </TabsTrigger>
                        <TabsTrigger value="pending" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs">
                          Pending
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                {/* Bulk Copy Button */}
                {filteredCodes?.length > 1 && (
                  <div className="flex justify-end mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyAllCodes}
                      className="flex items-center gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      Copy All Codes
                    </Button>
                  </div>
                )}

                {status === "pending" ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, index) => (
                      <Card key={index} className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg animate-pulse"></div>
                            <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg animate-pulse"></div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded animate-pulse"></div>
                              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded animate-pulse"></div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : status === "rejected" ? (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
                      <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                      Failed to Load Codes
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      {error || "Unable to fetch codes at the moment"}
                    </p>
                    <Button
                      onClick={() => dispatch(fetchCodes())}
                      className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
                    >
                      Try Again
                    </Button>
                  </div>
                ) : filteredCodes?.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                    {filteredCodes.map((code, index) => {
                      const { date: formattedDate, time: formattedTime } = safeFormatDate(code?.createdAt);
                      const codeValue = code?.code || "No Code Available";
                      const codeTypeValue = code?.codeType || "Unknown";
                      const resultsValue = code?.results || "";

                      return (
                        <motion.div
                          key={code?.id || index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full group hover:scale-105 cursor-pointer">
                            <CardContent className="p-6">
                              {/* Code Display */}
                              <div className="text-center mb-4">
                                <div className="font-mono font-bold text-2xl text-gray-900 dark:text-white bg-amber-50 dark:bg-amber-900/20 px-4 py-3 rounded-lg border-2 border-amber-200 dark:border-amber-800 mb-3">
                                  {codeValue}
                                </div>
                                <Button
                                  onClick={() => copyToClipboard(codeValue, code?.id)}
                                  className={`w-full ${
                                    copiedCodeId === code?.id
                                      ? "bg-green-500 hover:bg-green-600 text-white"
                                      : "bg-amber-500 hover:bg-amber-600 text-white"
                                  } transition-all`}
                                  size="sm"
                                  disabled={!codeValue || codeValue === "No Code Available"}
                                >
                                  {copiedCodeId === code?.id ? (
                                    <>
                                      <Check className="w-4 h-4 mr-2" />
                                      Copied!
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-4 h-4 mr-2" />
                                      Copy Code
                                    </>
                                  )}
                                </Button>
                              </div>

                              {/* Code Details */}
                              <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600 dark:text-gray-400">Type:</span>
                                  <Badge 
                                    variant="outline" 
                                    className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800"
                                  >
                                    {codeTypeValue}
                                  </Badge>
                                </div>

                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                                  <div className={`inline-flex items-center px-3 py-1 rounded-full border text-sm ${
                                    resultsValue === "win" 
                                      ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400" 
                                      : resultsValue === "loss" 
                                      ? "bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-900/20 dark:border-rose-800 dark:text-rose-400"
                                      : "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400"
                                  }`}>
                                    {resultsValue === "win" ? (
                                      <Check className="w-3 h-3 mr-1" />
                                    ) : resultsValue === "loss" ? (
                                      <Zap className="w-3 h-3 mr-1" />
                                    ) : (
                                      <Clock className="w-3 h-3 mr-1" />
                                    )}
                                    {resultsValue ? resultsValue.charAt(0).toUpperCase() + resultsValue.slice(1) : "Pending"}
                                  </div>
                                </div>

                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600 dark:text-gray-400">Added:</span>
                                  <div className="text-right">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                      {formattedDate}
                                    </div>
                                    {formattedTime && (
                                      <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {formattedTime}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Safe expiry date check */}
                                {code?.expiry && (
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Expires:</span>
                                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/50 dark:text-red-300">
                                      {safeFormatDate(code.expiry).date}
                                    </Badge>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                      <Filter className="w-8 h-8 text-amber-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                      No Codes Found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      {getEmptyStateMessage(searchTerm, activeFilter)}
                    </p>
                    {(searchTerm || activeFilter !== "all") && (
                      <Button
                        onClick={() => {
                          setActiveFilter("all");
                          setSearchTerm("");
                        }}
                        className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
                      >
                        Reset Filters
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // Fallback for unknown user type
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
      <Card className="max-w-md mx-4">
        <CardContent className="p-8 text-center">
          <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Access Required
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please log in to access premium features.
          </p>
          <Button onClick={() => navigate("/auth/login")}>
            Go to Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Premium;