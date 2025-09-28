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
  Filter
} from "lucide-react";
import "swiper/css";
import "swiper/css/pagination";

const getResultColor = (result) => {
  if (!result) return "text-amber-500"; // Pending
  const lowerResult = result.toLowerCase();
  return lowerResult === "win" 
    ? "text-emerald-600" 
    : lowerResult === "loss" 
      ? "text-rose-600" 
      : "text-amber-500";
};

const getResultBgColor = (result) => {
  if (!result) return "bg-amber-50 border-amber-200"; // Pending
  const lowerResult = result.toLowerCase();
  return lowerResult === "win" 
    ? "bg-emerald-50 border-emerald-200" 
    : lowerResult === "loss" 
      ? "bg-rose-50 border-rose-200" 
      : "bg-amber-50 border-amber-200";
};

const StatCard = ({ icon: Icon, title, value, description, color }) => (
  <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-0 shadow-lg">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{description}</p>
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </CardContent>
  </Card>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container px-4 py-8 mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 dark:from-white dark:to-blue-400 bg-clip-text text-transparent mb-4">
              Expert Football Predictions
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Data-driven insights and professional analysis to elevate your betting strategy
            </p>
          </motion.div>
        </div>

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
            description="Current success rate"
            color="bg-gradient-to-r from-emerald-500 to-emerald-600"
          />
          <StatCard
            icon={Target}
            title="Total Tips"
            value={totalTips.toString()}
            description="Predictions this week"
            color="bg-gradient-to-r from-blue-500 to-blue-600"
          />
          <StatCard
            icon={Shield}
            title="Accuracy"
            value="85%+"
            description="Historical performance"
            color="bg-gradient-to-r from-purple-500 to-purple-600"
          />
        </motion.div>

        {/* Main Tips Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-20"
        >
          <Card className="border-0 shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 dark:from-white dark:to-blue-400 bg-clip-text text-transparent">
                    Today's Predictions
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Real-time expert analysis and match predictions
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search matches or leagues..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full sm:w-64 bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600"
                    />
                  </div>
                  
                  <Tabs value={activeFilter} onValueChange={setActiveFilter}>
                    <TabsList className="bg-gray-100 dark:bg-gray-700 p-1">
                      <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        All
                      </TabsTrigger>
                      <TabsTrigger value="win" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        Wins
                      </TabsTrigger>
                      <TabsTrigger value="loss" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        Losses
                      </TabsTrigger>
                      <TabsTrigger value="pending" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
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
                <div className="p-8 space-y-4">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="flex gap-4 items-center">
                      <div className="w-3/4 h-16 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg animate-pulse"></div>
                      <div className="w-1/4 h-16 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg animate-pulse"></div>
                    </div>
                  ))}
                </div>
              ) : status === "rejected" ? (
                <div className="p-12 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center">
                    <XCircle className="w-10 h-10 text-rose-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    Failed to Load Tips
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                    {error || "Unable to fetch predictions at the moment"}
                  </p>
                  <Button
                    onClick={() => dispatch(fetchTips({ tipsType: "client" }))}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                  >
                    Try Again
                  </Button>
                </div>
              ) : filteredTips?.length > 0 ? (
                <div className="rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-800">
                        <tr>
                          <th className="px-6 py-4 text-left font-semibold text-gray-700 dark:text-gray-300">
                            Match
                          </th>
                          <th className="px-6 py-4 text-left font-semibold text-gray-700 dark:text-gray-300">
                            League
                          </th>
                          <th className="px-6py-4 text-left font-semibold text-gray-700 dark:text-gray-300">
                            Prediction
                          </th>
                          <th className="px-6 py-4 text-left font-semibold text-gray-700 dark:text-gray-300">
                            Odds
                          </th>
                          <th className="px-6 py-4 text-left font-semibold text-gray-700 dark:text-gray-300">
                            Time
                          </th>
                          <th className="px-6 py-4 text-left font-semibold text-gray-700 dark:text-gray-300">
                            Result
                          </th>
                          <th className="px-6 py-4 text-right font-semibold text-gray-700 dark:text-gray-300">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {filteredTips.map((tip) => (
                          <motion.tr 
                            key={tip.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                          >
                            <td className="px-6 py-4">
                              <div className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                                {tip.match}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <Badge 
                                variant="outline" 
                                className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800"
                              >
                                {tip.league}
                              </Badge>
                            </td>
                            <td className="px-6 py-4">
                              <Badge 
                                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 font-semibold"
                              >
                                {tip.prediction}
                              </Badge>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                                {tip.odds}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center text-gray-600 dark:text-gray-400">
                                <CalendarDays className="w-4 h-4 mr-2" />
                                {moment(tip.date).format("MMM D")} 
                                {tip.time && <span className="ml-1">• {tip.time}</span>}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className={`inline-flex items-center px-3 py-1 rounded-full border ${getResultBgColor(tip.results)}`}>
                                {tip.results ? (
                                  <>
                                    {tip.results === "Win" ? (
                                      <CheckCircle2 className="w-4 h-4 mr-1" />
                                    ) : (
                                      <XCircle className="w-4 h-4 mr-1" />
                                    )}
                                    <span className={`font-medium ${getResultColor(tip.results)}`}>
                                      {tip.results}
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <Clock className="w-4 h-4 mr-1 text-amber-500" />
                                    <span className="font-medium text-amber-500">
                                      Pending
                                    </span>
                                  </>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setExpandedTipId(expandedTipId === tip.id ? null : tip.id)}
                                className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
                              >
                                {expandedTipId === tip.id ? (
                                  <>
                                    <ChevronUp className="w-4 h-4" />
                                    Hide
                                  </>
                                ) : (
                                  <>
                                    <Eye className="w-4 h-4" />
                                    Details
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
                        transition={{ duration: 0.3 }}
                      >
                        <div className="p-6 border-t bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-800">
                          {filteredTips
                            .filter(tip => tip.id === expandedTipId)
                            .map(tip => (
                              <div key={tip.id} className="space-y-6">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Match Analysis
                                  </h4>
                                  <div className="flex gap-2">
                                    <Badge variant="secondary">{tip.league}</Badge>
                                    <Badge variant="outline">
                                      {moment(tip.date).format("MMM D, YYYY")}
                                    </Badge>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="flex items-center gap-2 text-lg">
                                        <Target className="w-5 h-5 text-blue-500" />
                                        Prediction Details
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <span className="text-gray-600 dark:text-gray-400">Type</span>
                                        <span className="font-semibold text-gray-900 dark:text-white">{tip.prediction}</span>
                                      </div>
                                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <span className="text-gray-600 dark:text-gray-400">Odds</span>
                                        <span className="font-bold text-green-600">{tip.odds}</span>
                                      </div>
                                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <span className="text-gray-600 dark:text-gray-400">Confidence</span>
                                        <span className="font-semibold text-amber-600">
                                          {tip.confidence || "High"}
                                        </span>
                                      </div>
                                    </CardContent>
                                  </Card>
                                  
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="flex items-center gap-2 text-lg">
                                        <TrendingUp className="w-5 h-5 text-green-500" />
                                        Team Statistics
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <span className="text-gray-600 dark:text-gray-400">Last 5 Home</span>
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                          {tip.homeForm || "3W-1D-1L"}
                                        </span>
                                      </div>
                                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <span className="text-gray-600 dark:text-gray-400">Last 5 Away</span>
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                          {tip.awayForm || "2W-2D-1L"}
                                        </span>
                                      </div>
                                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <span className="text-gray-600 dark:text-gray-400">H2H Record</span>
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                          {tip.h2h || "2-1-2"}
                                        </span>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>
                                
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                      <Star className="w-5 h-5 text-amber-500" />
                                      Expert Analysis
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                      {tip.analysis || "Our analysis indicates strong value in this selection based on current form, head-to-head statistics, and team motivation factors. The odds represent excellent value compared to the actual probability of success."}
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
                <div className="p-16 text-center">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                    <Filter className="w-10 h-10 text-amber-500" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
                    No Matching Predictions
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                    Try adjusting your filters or search terms. New predictions are added regularly throughout the day.
                  </p>
                  <Button
                    onClick={() => {
                      setActiveFilter("all");
                      setSearchTerm("");
                    }}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.section>

        {/* Testimonials Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-20"
        >
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-gray-900 to-blue-900 text-white overflow-hidden">
            <CardContent className="p-0">
              <div className="px-8 py-12 text-center">
                <div className="max-w-4xl mx-auto">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Star className="w-6 h-6 text-yellow-400 fill-current" />
                    <h2 className="text-3xl font-bold">Trusted by Thousands</h2>
                    <Star className="w-6 h-6 text-yellow-400 fill-current" />
                  </div>
                  <p className="mb-12 text-xl text-blue-200">
                    Join our community of successful bettors worldwide
                  </p>

                  <Swiper
                    spaceBetween={30}
                    centeredSlides={true}
                    autoplay={{
                      delay: 6000,
                      disableOnInteraction: false,
                    }}
                    pagination={{
                      clickable: true,
                      el: '.testimonial-pagination',
                    }}
                    modules={[Autoplay, Pagination]}
                    className="w-full"
                  >
                    {[
                      {
                        name: "James Rodriguez",
                        location: "Professional Bettor",
                        content: "I've increased my betting profits by 300% since following these tips. The analysis is incredibly thorough and data-driven.",
                        avatar: "JR",
                      },
                      {
                        name: "Sarah Chen",
                        location: "Sports Analyst",
                        content: "As someone who analyzes sports professionally, I'm impressed by the depth of research. This service stands out from the rest.",
                        avatar: "SC",
                      },
                      {
                        name: "Mohammed Ali",
                        location: "VIP Member",
                        content: "The consistency is unmatched. I've tried many services but none compare to this level of accuracy and professionalism.",
                        avatar: "MA",
                      },
                    ].map((testimonial, index) => (
                      <SwiperSlide key={index}>
                        <div className="px-4 py-8">
                          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                            {testimonial.avatar}
                          </div>
                          <blockquote className="max-w-2xl mx-auto mb-8 text-xl font-medium leading-8">
                            "{testimonial.content}"
                          </blockquote>
                          <div>
                            <p className="text-lg font-semibold">{testimonial.name}</p>
                            <p className="text-blue-300">{testimonial.location}</p>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  <div className="testimonial-pagination flex justify-center mt-8 gap-2"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card className="border-0 shadow-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <CardContent className="relative px-8 py-16 text-center">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-4xl font-bold mb-6">
                  Ready to Elevate Your Betting?
                </h2>
                <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                  Get access to premium predictions, advanced analytics, and exclusive insights that professional bettors use.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button
                    size="lg"
                    className="px-8 py-4 text-lg font-semibold bg-white text-blue-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all"
                  >
                    <Users className="w-5 h-5 mr-2" />
                    Join VIP Now
                    <ArrowUpRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-8 py-4 text-lg font-semibold border-white text-white hover:bg-white/10"
                  >
                    Learn More
                  </Button>
                </div>
                <p className="mt-6 text-blue-200 text-sm">
                  Start with a 7-day free trial • Cancel anytime
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </div>
  );
};

export default Home;