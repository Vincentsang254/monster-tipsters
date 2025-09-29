/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { motion, AnimatePresence } from "framer-motion";
import { fetchTips } from "@/features/slices/tipsSlice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { 
  CalendarDays, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Eye, 
  ChevronUp,
  Search,
  TrendingUp,
  Target,
  Shield,
  Star,
  Users,
  ArrowUpRight,
  Filter,
  Crown,
  Zap,
  BarChart3,
  Trophy,
  Sparkles
} from "lucide-react";
import "swiper/css";
import "swiper/css/pagination";

const getResultColor = (result) => {
  if (!result) return "text-amber-500";
  const lowerResult = result.toLowerCase();
  return lowerResult === "win" 
    ? "text-emerald-600" 
    : lowerResult === "loss" 
      ? "text-rose-600" 
      : "text-amber-500";
};

const getResultBgColor = (result) => {
  if (!result) return "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800";
  const lowerResult = result.toLowerCase();
  return lowerResult === "win" 
    ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800" 
    : lowerResult === "loss" 
      ? "bg-rose-50 border-rose-200 dark:bg-rose-900/20 dark:border-rose-800" 
      : "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800";
};

const StatCard = ({ icon: Icon, title, value, description, color, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
  >
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{title}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
          </div>
          <div className={`p-4 rounded-2xl ${color} group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const Home = () => {
  const dispatch = useDispatch();
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedTipId, setExpandedTipId] = useState(null);

  const { status, error } = useSelector((state) => state.tips);
  const tips = useSelector((state) => state.tips.list);

  useEffect(() => {
    dispatch(fetchTips({ tipsType: "client" }));
  }, [dispatch]);

  const clientTips = tips?.filter(tip => tip.tipsType === "client");

  const filteredTips = clientTips?.filter((tip) => {
    const matchesSearch =
      tip.match?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tip.league?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab =
      activeFilter === "all"
        ? true
        : activeFilter === "win"
        ? tip.results?.toLowerCase() === "win"
        : activeFilter === "loss"
        ? tip.results?.toLowerCase() === "loss"
        : activeFilter === "pending"
        ? !tip.results
        : true;

    return matchesSearch && matchesTab;
  });

  // Calculate stats
  const totalTips = clientTips?.length || 0;
  const winTips = clientTips?.filter(tip => tip.results?.toLowerCase() === "win").length || 0;
  const winRate = totalTips > 0 ? Math.round((winTips / totalTips) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative container px-4 py-8 mx-auto max-w-7xl">
        {/* Header Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 pt-8"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-6 py-3 mb-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold shadow-lg"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            PROFESSIONAL BETTING PREDICTIONS
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 dark:from-white dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-6 leading-tight">
            Win Smarter
            <br />
            <span className="text-4xl md:text-6xl">Not Harder</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed">
            Data-driven football predictions with <span className="font-semibold text-blue-600 dark:text-blue-400">85%+ accuracy</span>. 
            Join thousands of successful bettors making informed decisions.
          </p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8"
          >
            <Button
              size="lg"
              className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all"
            >
              <Crown className="w-5 h-5 mr-2" />
              Get Premium Tips
              <ArrowUpRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-4 text-lg font-semibold border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              View Statistics
            </Button>
          </motion.div>
        </motion.section>

        {/* Stats Overview */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
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
            icon={Target}
            title="Total Tips"
            value={totalTips.toString()}
            description="This Week's Predictions"
            color="bg-gradient-to-r from-blue-500 to-blue-600"
            delay={0.2}
          />
          <StatCard
            icon={Trophy}
            title="Accuracy"
            value="85%+"
            description="Historical Performance"
            color="bg-gradient-to-r from-purple-500 to-purple-600"
            delay={0.3}
          />
        </motion.section>

        {/* Main Tips Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-20"
        >
          <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm overflow-hidden">
            <CardHeader className="pb-6 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-800">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 dark:from-white dark:to-blue-400 bg-clip-text text-transparent">
                    Today's Expert Predictions
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
                    Real-time analysis from our professional betting team
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      placeholder="Search matches or leagues..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 pr-4 py-3 w-full sm:w-72 bg-white/70 dark:bg-gray-700/70 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 transition-colors"
                    />
                  </div>
                  
                  <Tabs value={activeFilter} onValueChange={setActiveFilter} className="w-full sm:w-auto">
                    <TabsList className="bg-gray-100 dark:bg-gray-700 p-2 rounded-xl border border-gray-200 dark:border-gray-600">
                      <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-gray-200 rounded-lg px-4">
                        All
                      </TabsTrigger>
                      <TabsTrigger value="win" className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-gray-200 rounded-lg px-4">
                        Wins
                      </TabsTrigger>
                      <TabsTrigger value="loss" className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-gray-200 rounded-lg px-4">
                        Losses
                      </TabsTrigger>
                      <TabsTrigger value="pending" className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-gray-200 rounded-lg px-4">
                        Pending
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {/* Tips Table */}
              {status === "pending" ? (
                <div className="p-12 space-y-6">
                  {[...Array(5)].map((_, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-6 items-center p-4"
                    >
                      <div className="w-3/4 h-20 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-2xl animate-pulse"></div>
                      <div className="w-1/4 h-20 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-2xl animate-pulse"></div>
                    </motion.div>
                  ))}
                </div>
              ) : status === "rejected" ? (
                <div className="p-16 text-center">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center">
                    <XCircle className="w-12 h-12 text-rose-500" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
                    Connection Issue
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto text-lg">
                    {error || "Unable to fetch predictions at the moment. Please check your connection."}
                  </p>
                  <Button
                    onClick={() => dispatch(fetchTips({ tipsType: "client" }))}
                    className="px-8 py-3 text-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg rounded-xl"
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Try Again
                  </Button>
                </div>
              ) : filteredTips?.length > 0 ? (
                <div className="rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-gray-700 dark:to-gray-800">
                        <tr>
                          <th className="px-8 py-6 text-left font-bold text-gray-700 dark:text-gray-300 text-lg">
                            Match
                          </th>
                          <th className="px-6 py-6 text-left font-bold text-gray-700 dark:text-gray-300">
                            League
                          </th>
                          <th className="px-6 py-6 text-left font-bold text-gray-700 dark:text-gray-300">
                            Prediction
                          </th>
                          <th className="px-6 py-6 text-left font-bold text-gray-700 dark:text-gray-300">
                            Odds
                          </th>
                          <th className="px-6 py-6 text-left font-bold text-gray-700 dark:text-gray-300">
                            Time
                          </th>
                          <th className="px-6 py-6 text-left font-bold text-gray-700 dark:text-gray-300">
                            Result
                          </th>
                          <th className="px-8 py-6 text-right font-bold text-gray-700 dark:text-gray-300">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {filteredTips.map((tip, index) => (
                          <motion.tr 
                            key={tip.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300 group border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                          >
                            <td className="px-8 py-6">
                              <div className="font-bold text-gray-900 dark:text-white text-lg group-hover:text-blue-600 transition-colors">
                                {tip.match}
                              </div>
                            </td>
                            <td className="px-6 py-6">
                              <Badge 
                                variant="outline" 
                                className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800 px-3 py-1 text-sm font-semibold"
                              >
                                {tip.league}
                              </Badge>
                            </td>
                            <td className="px-6 py-6">
                              <Badge 
                                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 font-bold px-4 py-2 text-sm shadow-lg"
                              >
                                {tip.prediction}
                              </Badge>
                            </td>
                            <td className="px-6 py-6">
                              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800">
                                {tip.odds}
                              </span>
                            </td>
                            <td className="px-6 py-6">
                              <div className="flex items-center text-gray-600 dark:text-gray-400 font-medium">
                                <CalendarDays className="w-5 h-5 mr-3" />
                                {moment(tip.date).format("MMM D")} 
                                {tip.time && <span className="ml-2">• {tip.time}</span>}
                              </div>
                            </td>
                            <td className="px-6 py-6">
                              <div className={`inline-flex items-center px-4 py-2 rounded-full border-2 ${getResultBgColor(tip.results)}`}>
                                {tip.results ? (
                                  <>
                                    {tip.results === "Win" ? (
                                      <CheckCircle2 className="w-5 h-5 mr-2" />
                                    ) : (
                                      <XCircle className="w-5 h-5 mr-2" />
                                    )}
                                    <span className={`font-bold ${getResultColor(tip.results)}`}>
                                      {tip.results}
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <Clock className="w-5 h-5 mr-2 text-amber-500" />
                                    <span className="font-bold text-amber-500">
                                      Pending
                                    </span>
                                  </>
                                )}
                              </div>
                            </td>
                            <td className="px-8 py-6 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setExpandedTipId(expandedTipId === tip.id ? null : tip.id)}
                                className="flex items-center gap-3 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 font-semibold px-4 py-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                              >
                                {expandedTipId === tip.id ? (
                                  <>
                                    <ChevronUp className="w-5 h-5" />
                                    Hide Details
                                  </>
                                ) : (
                                  <>
                                    <Eye className="w-5 h-5" />
                                    View Analysis
                                  </>
                                )}
                              </Button>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Expanded details */}
                  <AnimatePresence>
                    {expandedTipId && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <div className="p-8 border-t bg-gradient-to-r from-slate-50 to-blue-50 dark:from-gray-700 dark:to-gray-800">
                          {filteredTips
                            .filter(tip => tip.id === expandedTipId)
                            .map(tip => (
                              <div key={tip.id} className="space-y-8">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    In-Depth Match Analysis
                                  </h4>
                                  <div className="flex gap-3">
                                    <Badge variant="secondary" className="px-4 py-2 text-sm">{tip.league}</Badge>
                                    <Badge variant="outline" className="px-4 py-2 text-sm">
                                      {moment(tip.date).format("MMM D, YYYY")}
                                    </Badge>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                  <Card className="border-0 shadow-lg bg-white/70 dark:bg-gray-800/70">
                                    <CardHeader>
                                      <CardTitle className="flex items-center gap-3 text-xl">
                                        <Target className="w-6 h-6 text-blue-500" />
                                        Prediction Details
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                      {[
                                        { label: "Prediction Type", value: tip.prediction, color: "text-blue-600" },
                                        { label: "Current Odds", value: tip.odds, color: "text-green-600 font-bold" },
                                        { label: "Confidence Level", value: tip.confidence || "High", color: "text-amber-600 font-semibold" },
                                      ].map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                          <span className="text-gray-600 dark:text-gray-400 font-medium">{item.label}</span>
                                          <span className={`font-semibold ${item.color}`}>{item.value}</span>
                                        </div>
                                      ))}
                                    </CardContent>
                                  </Card>
                                  
                                  <Card className="border-0 shadow-lg bg-white/70 dark:bg-gray-800/70">
                                    <CardHeader>
                                      <CardTitle className="flex items-center gap-3 text-xl">
                                        <TrendingUp className="w-6 h-6 text-green-500" />
                                        Team Statistics
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                      {[
                                        { label: "Last 5 Home Form", value: tip.homeForm || "3W-1D-1L" },
                                        { label: "Last 5 Away Form", value: tip.awayForm || "2W-2D-1L" },
                                        { label: "Head-to-Head", value: tip.h2h || "2-1-2" },
                                      ].map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                          <span className="text-gray-600 dark:text-gray-400 font-medium">{item.label}</span>
                                          <span className="font-semibold text-gray-900 dark:text-white">{item.value}</span>
                                        </div>
                                      ))}
                                    </CardContent>
                                  </Card>
                                </div>
                                
                                <Card className="border-0 shadow-lg bg-white/70 dark:bg-gray-800/70">
                                  <CardHeader>
                                    <CardTitle className="flex items-center gap-3 text-xl">
                                      <Star className="w-6 h-6 text-amber-500" />
                                      Expert Analysis & Insights
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                                      {tip.analysis || "Our comprehensive analysis indicates strong value in this selection based on current team form, head-to-head statistics, player injuries, and motivational factors. The current odds represent excellent value compared to the actual probability of success. Key factors considered include recent performance trends, tactical matchups, and external conditions that could influence the match outcome."}
                                    </p>
                                  </CardContent>
                                </Card>
                              </div>
                            ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="p-20 text-center">
                  <div className="w-28 h-28 mx-auto mb-8 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                    <Filter className="w-14 h-14 text-amber-500" />
                  </div>
                  <h3 className="text-3xl font-semibold text-gray-800 dark:text-white mb-4">
                    No Matching Predictions Found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-10 max-w-md mx-auto text-lg">
                    Try adjusting your search terms or filters. New expert predictions are added throughout the day.
                  </p>
                  <Button
                    onClick={() => {
                      setActiveFilter("all");
                      setSearchTerm("");
                    }}
                    className="px-8 py-4 text-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-xl rounded-xl"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Reset Filters
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.section>

        {/* Testimonials Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-20"
        >
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
            <CardContent className="relative p-0">
              <div className="px-8 py-16 text-center">
                <div className="max-w-5xl mx-auto">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-3 mb-6"
                  >
                    <Star className="w-8 h-8 text-yellow-400 fill-current" />
                    <h2 className="text-4xl font-bold">Trusted by Professional Bettors</h2>
                    <Star className="w-8 h-8 text-yellow-400 fill-current" />
                  </motion.div>
                  <p className="mb-16 text-xl text-blue-200 max-w-2xl mx-auto">
                    Join thousands of successful bettors who have transformed their strategy with our data-driven predictions
                  </p>

                  <Swiper
                    spaceBetween={40}
                    centeredSlides={true}
                    autoplay={{
                      delay: 8000,
                      disableOnInteraction: false,
                    }}
                    pagination={{
                      clickable: true,
                      el: '.testimonial-pagination',
                    }}
                    modules={[Autoplay, Pagination]}
                    className="w-full max-w-4xl"
                  >
                    {[
                      {
                        name: "James Rodriguez",
                        location: "Professional Sports Bettor",
                        content: "I've increased my betting profits by over 300% since following these tips. The depth of analysis is incredible - it's like having a professional sports analyst on your team 24/7.",
                        avatar: "JR",
                        profit: "+300%"
                      },
                      {
                        name: "Sarah Chen",
                        location: "Former Sports Analyst",
                        content: "As someone who worked in sports analytics, I can confidently say this service stands out. The data-driven approach and attention to detail are unmatched in the industry.",
                        avatar: "SC",
                        profit: "+250%"
                      },
                      {
                        name: "Mohammed Ali",
                        location: "VIP Member Since 2022",
                        content: "The consistency and accuracy are phenomenal. I've tried numerous services, but none deliver this level of professional insights and reliable predictions.",
                        avatar: "MA",
                        profit: "+280%"
                      },
                    ].map((testimonial, index) => (
                      <SwiperSlide key={index}>
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="px-4 py-8"
                        >
                          <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                            {testimonial.avatar}
                          </div>
                          <div className="mb-6">
                            <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-4 py-2 mb-4">
                              Profit Increase: {testimonial.profit}
                            </Badge>
                          </div>
                          <blockquote className="max-w-3xl mx-auto mb-8 text-2xl font-medium leading-relaxed">
                            "{testimonial.content}"
                          </blockquote>
                          <div>
                            <p className="text-xl font-semibold mb-1">{testimonial.name}</p>
                            <p className="text-blue-300">{testimonial.location}</p>
                          </div>
                        </motion.div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  <div className="testimonial-pagination flex justify-center mt-12 gap-3"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Final CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card className="border-0 shadow-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
            
            <CardContent className="relative px-8 py-20 text-center">
              <div className="max-w-4xl mx-auto">
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="inline-flex items-center px-6 py-3 mb-8 rounded-full bg-white/20 backdrop-blur-sm text-white text-lg font-semibold"
                >
                  <Crown className="w-6 h-6 mr-3" />
                  LIMITED TIME OFFER
                </motion.div>
                
                <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
                  Ready to Transform
                  <br />
                  Your Betting Results?
                </h2>
                
                <p className="text-xl md:text-2xl text-blue-100 mb-12 leading-relaxed max-w-3xl mx-auto">
                  Join our VIP community today and start making informed, profitable betting decisions with our expert predictions and advanced analytics.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
                  <Button
                    size="lg"
                    className="px-12 py-6 text-xl font-bold bg-white text-blue-600 hover:bg-gray-100 shadow-2xl hover:shadow-3xl transition-all rounded-2xl"
                  >
                    <Crown className="w-6 h-6 mr-3" />
                    Start VIP Free Trial
                    <ArrowUpRight className="w-5 h-5 ml-3" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-12 py-6 text-xl font-bold border-3 border-white text-white hover:bg-white/10 backdrop-blur-sm rounded-2xl"
                  >
                    <Users className="w-6 h-6 mr-3" />
                    View Pricing Plans
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-blue-200 text-sm max-w-2xl mx-auto">
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>7-Day Free Trial</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Cancel Anytime</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>85%+ Accuracy Guarantee</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </div>
  );
};

export default Home;