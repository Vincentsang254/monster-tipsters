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
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { CalendarDays, CheckCircle2, XCircle, Clock, Eye, ChevronUp } from "lucide-react";
import "swiper/css";
import "swiper/css/pagination";

const getResultColor = (result) => {
  if (!result) return "text-gray-500"; // Pending
  const lowerResult = result.toLowerCase();
  return lowerResult === "win" 
    ? "text-green-600" 
    : lowerResult === "loss" 
      ? "text-red-600" 
      : "text-gray-500";
};

const Home = () => {
  const dispatch = useDispatch();
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedTipId, setExpandedTipId] = useState(null);

  const { status, error } = useSelector((state) => state.tips);
  const tips = useSelector((state) => state.tips.list);

  useEffect(() => {
    // Only fetch tips with tipsType "client"
    dispatch(fetchTips({ tipsType: "client" }));
  }, [dispatch]);

  // Filter tips to only show client tips (additional safeguard)
  const clientTips = tips?.filter(tip => tip.tipsType === "client");

  const filteredTips = clientTips?.filter((tip) => {
    const matchesSearch =
      tip.match.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tip.league.toLowerCase().includes(searchTerm.toLowerCase());

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

  return (
    <div className="container px-4 py-12 mx-auto max-w-7xl">
      {/* Main Tips Section */}
      <section className="mb-20">
        <div className="flex flex-col items-center justify-between gap-6 mb-10 md:flex-row">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Today's Predictions
            </h2>
            <p className="mt-3 text-lg text-gray-600">
              Expertly analyzed football tips with proven track record
            </p>
          </div>
          
          <div className="flex flex-col w-full gap-3 sm:flex-row sm:w-auto">
            <Input
              placeholder="Search matches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64"
            />
            
            <Tabs value={activeFilter} onValueChange={setActiveFilter}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="win">Wins</TabsTrigger>
                <TabsTrigger value="loss">Losses</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Tips Table */}
        {status === "pending" ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="w-full h-16 bg-gray-200 rounded-md animate-pulse"></div>
            ))}
          </div>
        ) : status === "rejected" ? (
          <div className="p-8 text-center bg-white rounded-lg shadow">
            <div className="mb-4 text-red-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-800">
              Failed to Load Tips
            </h3>
            <p className="mb-6 text-gray-600">
              {error || "An unknown error occurred"}
            </p>
            <Button
              onClick={() => dispatch(fetchTips({ tipsType: "client" }))}
              className="bg-primary hover:bg-primary/90"
            >
              Try Again
            </Button>
          </div>
        ) : filteredTips?.length > 0 ? (
          <div className="border rounded-lg shadow-sm">
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 w-[30%]">
                      Match
                    </th>
                    <th scope="col" className="px-6 py-3">
                      League
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Prediction
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Odds
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Time
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Result
                    </th>
                    <th scope="col" className="px-6 py-3 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTips.map((tip) => (
                    <tr 
                      key={tip.id} 
                      className="bg-white border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium whitespace-nowrap">
                        {tip.match}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="secondary" className="text-xs">
                          {tip.league}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge 
                          variant="outline" 
                          className="font-bold text-primary border-primary"
                        >
                          {tip.prediction}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 font-medium">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {tip.odds}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-gray-500">
                          <CalendarDays className="w-4 h-4 mr-1" />
                          {moment(tip.date).format("MMM D")} 
                          {tip.time && <span className="ml-1">• {tip.time}</span>}
                        </div>
                      </td>
                      <td className={`px-6 py-4 font-medium ${getResultColor(tip.results)}`}>
                        {tip.results ? (
                          <span className="inline-flex items-center">
                            {tip.results === "Win" ? (
                              <CheckCircle2 className="w-4 h-4 mr-1" />
                            ) : (
                              <XCircle className="w-4 h-4 mr-1" />
                            )}
                            {tip.results}
                          </span>
                        ) : (
                          <span className="inline-flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setExpandedTipId(expandedTipId === tip.id ? null : tip.id)}
                          className="flex items-center gap-1"
                        >
                          {expandedTipId === tip.id ? (
                            <>
                              <ChevronUp className="w-4 h-4" />
                              Hide
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4" />
                              View
                            </>
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Expanded details for selected tip */}
            <AnimatePresence>
              {expandedTipId && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 border-t bg-gray-50">
                    {filteredTips
                      .filter(tip => tip.id === expandedTipId)
                      .map(tip => (
                        <div key={tip.id} className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="text-lg font-semibold">Match Analysis</h4>
                            <div className="flex gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {tip.league}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {moment(tip.date).format("MMM D, YYYY")}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="p-4 bg-white rounded-lg shadow-sm">
                              <h5 className="mb-2 font-medium text-gray-700">Prediction Details</h5>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Type:</span>
                                  <span className="font-medium">{tip.prediction}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Odds:</span>
                                  <span className="font-medium">{tip.odds}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Confidence:</span>
                                  <span className="font-medium">
                                    {tip.confidence || "High"}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="p-4 bg-white rounded-lg shadow-sm">
                              <h5 className="mb-2 font-medium text-gray-700">Statistics</h5>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Last 5 Home:</span>
                                  <span className="font-medium">
                                    {tip.homeForm || "3W-1D-1L"}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Last 5 Away:</span>
                                  <span className="font-medium">
                                    {tip.awayForm || "2W-2D-1L"}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">H2H:</span>
                                  <span className="font-medium">
                                    {tip.h2h || "2-1-2"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-4 bg-white rounded-lg shadow-sm">
                            <h5 className="mb-2 font-medium text-gray-700">Expert Analysis</h5>
                            <p className="text-gray-600">
                              {tip.analysis || "No detailed analysis available for this tip."}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="p-12 text-center bg-white rounded-lg shadow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-16 h-16 mx-auto mb-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mb-3 text-2xl font-semibold text-gray-800">
              No Tips Match Your Filters
            </h3>
            <p className="max-w-md mx-auto mb-6 text-gray-600">
              Try adjusting your filters or check back later for new predictions.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setActiveFilter("all");
                setSearchTerm("");
              }}
              className="border-primary text-primary hover:bg-primary/10"
            >
              Reset Filters
            </Button>
          </div>
        )}
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50 rounded-2xl">
        <div className="max-w-4xl px-4 mx-auto text-center">
          <h2 className="mb-2 text-3xl font-bold text-gray-900 sm:text-4xl">
            Trusted by Bettors Worldwide
          </h2>
          <p className="mb-12 text-lg text-gray-600">
            Join thousands of satisfied users who improved their betting success
          </p>

          <Swiper
            spaceBetween={30}
            centeredSlides={true}
            autoplay={{
              delay: 8000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            modules={[Autoplay, Pagination]}
            className="w-full"
          >
            {[
              {
                name: "James Rodriguez",
                location: "London, UK",
                content: "I've increased my betting profits by 300% since following these tips. The analysis is incredibly thorough.",
                rating: 5,
              },
              {
                name: "Sarah Chen",
                location: "Toronto, Canada",
                content: "As someone new to sports betting, these predictions have been invaluable. I finally understand what to look for in matches.",
                rating: 5,
              },
              {
                name: "Mohammed Ali",
                location: "Dubai, UAE",
                content: "The consistency of wins is unmatched. I've tried many services but none compare to this level of accuracy.",
                rating: 4,
              },
            ].map((testimonial, index) => (
              <SwiperSlide key={index}>
                <div className="px-8 py-12">
                  <div className="flex justify-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-6 h-6 ${
                          i < testimonial.rating ? "text-yellow-400" : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <blockquote className="max-w-2xl mx-auto mb-8 text-xl font-medium leading-8 text-gray-900">
                    "{testimonial.content}"
                  </blockquote>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-gray-600">{testimonial.location}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mt-20">
        <div className="px-8 py-16 text-center bg-primary rounded-2xl">
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            Ready to transform your betting results?
          </h2>
          <p className="max-w-2xl mx-auto mb-8 text-xl text-blue-100">
            Get access to our premium predictions with detailed analysis.
          </p>
          <Button
            size="lg"
            className="px-8 py-4 text-lg font-semibold bg-white text-primary hover:bg-gray-100"
          >
            Upgrade Now
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;