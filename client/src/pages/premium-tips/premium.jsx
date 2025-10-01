/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
/** @format */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { format, parseISO } from "date-fns";
import { Check, Zap, Clock, Copy, Crown, Filter, Search, TrendingUp, Users, Award } from "lucide-react";
import { fetchCodes } from "@/features/slices/codeSlice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Premium = () => {
  const dispatch = useDispatch();
  const { list: codes, status, error } = useSelector((state) => state.codes);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [copiedCodeId, setCopiedCodeId] = useState(null);

  useEffect(() => {
    dispatch(fetchCodes());
  }, [dispatch]);

  const filteredCodes = codes?.filter((code) => {
    const matchesSearch = code?.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         code?.codeType?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = 
      activeFilter === "all" ? true :
      activeFilter === "win" ? code?.results === "win" :
      activeFilter === "loss" ? code?.results === "loss" :
      activeFilter === "pending" ? !code?.results : true;

    return matchesSearch && matchesFilter;
  });

  const copyToClipboard = async (code, codeId) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCodeId(codeId);
      setTimeout(() => setCopiedCodeId(null), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

  // Calculate stats
  const totalCodes = codes?.length || 0;
  const winCodes = codes?.filter(code => code?.results === "win").length || 0;
  const winRate = totalCodes > 0 ? Math.round((winCodes / totalCodes) * 100) : 0;

  const StatCard = ({ icon: Icon, title, value, description, color, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{title}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
            </div>
            <div className={`p-3 rounded-xl ${color}`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container px-4 py-8 mx-auto max-w-7xl">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center px-4 py-2 mb-6 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-semibold">
            <Crown className="w-4 h-4 mr-2" />
            PREMIUM BETTING CODES
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-amber-600 dark:from-white dark:to-amber-400 bg-clip-text text-transparent mb-4">
            Exclusive Betting Codes
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Get instant access to premium betting codes with proven success rates
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
                <div>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-amber-600 dark:from-white dark:to-amber-400 bg-clip-text text-transparent">
                    Premium Codes Dashboard
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Copy and use these exclusive betting codes instantly
                  </p>
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
              {status === "pending" ? (
                <div className="p-12 space-y-4">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="flex gap-4 items-center">
                      <div className="w-3/4 h-16 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg animate-pulse"></div>
                      <div className="w-1/4 h-16 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg animate-pulse"></div>
                    </div>
                  ))}
                </div>
              ) : status === "rejected" ? (
                <div className="p-12 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
                    <Zap className="w-10 h-10 text-red-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    Failed to Load Codes
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
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
                <div className="rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-gray-50 to-amber-50 dark:from-gray-700 dark:to-amber-900/20">
                        <tr>
                          <th className="px-6 py-4 text-left font-semibold text-gray-700 dark:text-gray-300">
                            Betting Code
                          </th>
                          <th className="px-6 py-4 text-left font-semibold text-gray-700 dark:text-gray-300">
                            Code Type
                          </th>
                          <th className="px-6 py-4 text-center font-semibold text-gray-700 dark:text-gray-300">
                            Status
                          </th>
                          <th className="px-6 py-4 text-right font-semibold text-gray-700 dark:text-gray-300">
                            Date Added
                          </th>
                          <th className="px-6 py-4 text-center font-semibold text-gray-700 dark:text-gray-300">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {filteredCodes.map((code, index) => {
                          const date = parseISO(code?.createdAt);
                          const formattedDate = format(date, "MMM dd, yyyy");
                          const formattedTime = format(date, "hh:mm a");

                          return (
                            <motion.tr 
                              key={code?.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                            >
                              {/* Code */}
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="font-mono font-bold text-lg text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg border-2 border-amber-200 dark:border-amber-800 group-hover:border-amber-300 transition-colors">
                                    {code?.code}
                                  </div>
                                </div>
                              </td>

                              {/* Code Type */}
                              <td className="px-6 py-4">
                                <Badge 
                                  variant="outline" 
                                  className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800 font-semibold"
                                >
                                  {code?.codeType}
                                </Badge>
                              </td>

                              {/* Results */}
                              <td className="px-6 py-4 text-center">
                                <div className={`inline-flex items-center px-3 py-2 rounded-full border ${
                                  code?.results === "win" 
                                    ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800" 
                                    : code?.results === "loss" 
                                    ? "bg-rose-50 border-rose-200 dark:bg-rose-900/20 dark:border-rose-800"
                                    : "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800"
                                }`}>
                                  {code?.results === "win" ? (
                                    <Check className="w-4 h-4 mr-2 text-emerald-600 dark:text-emerald-400" />
                                  ) : code?.results === "loss" ? (
                                    <Zap className="w-4 h-4 mr-2 text-rose-600 dark:text-rose-400" />
                                  ) : (
                                    <Clock className="w-4 h-4 mr-2 text-amber-600 dark:text-amber-400" />
                                  )}
                                  <span className={`font-medium ${
                                    code?.results === "win" 
                                      ? "text-emerald-600 dark:text-emerald-400"
                                      : code?.results === "loss"
                                      ? "text-rose-600 dark:text-rose-400"
                                      : "text-amber-600 dark:text-amber-400"
                                  }`}>
                                    {code?.results ? code.results.charAt(0).toUpperCase() + code.results.slice(1) : "Pending"}
                                  </span>
                                </div>
                              </td>

                              {/* Date */}
                              <td className="px-6 py-4 text-right">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {formattedDate}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {formattedTime}
                                </div>
                              </td>

                              {/* Copy Action */}
                              <td className="px-6 py-4 text-center">
                                <Button
                                  size="sm"
                                  onClick={() => copyToClipboard(code?.code, code?.id)}
                                  className={`flex items-center gap-2 ${
                                    copiedCodeId === code?.id
                                      ? "bg-green-500 hover:bg-green-600 text-white"
                                      : "bg-amber-500 hover:bg-amber-600 text-white"
                                  } transition-all`}
                                >
                                  {copiedCodeId === code?.id ? (
                                    <>
                                      <Check className="w-4 h-4" />
                                      Copied!
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-4 h-4" />
                                      Copy Code
                                    </>
                                  )}
                                </Button>
                              </td>
                            </motion.tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="p-16 text-center">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                    <Filter className="w-10 h-10 text-amber-500" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
                    No Codes Found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                    {searchTerm || activeFilter !== "all" 
                      ? "Try adjusting your search terms or filters."
                      : "No premium codes available at the moment. Check back later!"
                    }
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

        {/* Instructions Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Copy className="w-5 h-5 text-blue-500" />
                Copy Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Click the "Copy Code" button to instantly copy the betting code to your clipboard.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Use Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Paste the code in your betting platform. Check the status to see historical performance.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Crown className="w-5 h-5 text-amber-500" />
                Track Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Monitor code performance with real-time status updates and historical win rates.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Premium;