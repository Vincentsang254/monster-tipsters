/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-toastify";
import axios from "axios";
import { setHeaders, url } from "@/features/slices/api";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadUser, refreshToken } from "@/features/slices/authSlice";
import { motion } from "framer-motion";
import { 
  Shield, 
  Lock, 
  Smartphone, 
  CreditCard, 
  CheckCircle2,
  ArrowLeft,
  Zap,
  Loader2
} from "lucide-react";

const Payment = () => {
  const { amount: paramAmount } = useParams();
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAmountLocked, setIsAmountLocked] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("mpesa");
  const dispatch = useDispatch();
  const { name, id } = useSelector((state) => state.auth);

  // Map amount to plan name
  const getPlanName = (amt) => {
    const plans = {
      "499": "Starter Plan (3 days)",
      "1499": "Pro Plan (7 days)", 
      "2499": "Elite Plan (1 month)"
    };
    return plans[amt] || "Premium Plan";
  };

  // Initialize amount from params and lock it if present
  useEffect(() => {
    if (paramAmount) {
      setAmount(paramAmount);
      setIsAmountLocked(true);
    }
  }, [paramAmount]);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  const paymentMethods = [
    {
      id: "mpesa",
      name: "M-Pesa",
      icon: Smartphone,
      description: "Pay via M-Pesa STK Push",
      color: "from-green-500 to-green-600"
    },
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: CreditCard,
      description: "Pay with Visa, Mastercard",
      color: "from-blue-500 to-blue-600",
      disabled: true
    }
  ];

  const handlePayment = async () => {
    if (!phone || phone.length < 9) {
      toast.error("Please enter a valid phone number", { position: "top-center" });
      return;
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Please enter a valid amount", { position: "top-center" });
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${url}/payment/stkpush`,
        { 
          phone: `254${phone}`, // Ensure proper format
          amount, 
          name,
          id
        },
        setHeaders()
      );
      
      console.log("Payment response:", response.data);
      
      if (response.data.success) {
        toast.success(response.data.message || "Payment initiated successfully! Check your phone.", { 
          position: "top-center",
          autoClose: 5000
        });
        
        // Redirect to success page or back to premium
        setTimeout(() => {
          navigate("/user/vip");
        }, 3000);
      } else {
        toast.error(response.data.message || "Payment failed. Please try again.", {
          position: "top-center"
        });
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(
        error.response?.data?.message || "Payment failed. Please try again.",
        { position: "top-center" }
      );
    } finally {
      setIsLoading(false);
      dispatch(refreshToken());
    }
  };

  const handlePhoneChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 9);
    setPhone(digits);
  };

  const handleAmountChange = (e) => {
    if (!isAmountLocked) {
      const value = e.target.value.replace(/\D/g, "");
      setAmount(value);
    }
  };

  const formatPhoneNumber = (phone) => {
    if (phone.length === 9) {
      return `+254 ${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6)}`;
    }
    return phone;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container px-4 py-8 mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate("/premium")}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Plans
          </Button>
          
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-amber-600 dark:from-white dark:to-amber-400 bg-clip-text text-transparent mb-4">
            Complete Your Purchase
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            You're subscribing to: <strong>{getPlanName(amount)}</strong>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400">Plan:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {getPlanName(amount)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                  <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    KES {amount}
                  </span>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 dark:text-white">What you'll get:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                      Exclusive premium betting codes
                    </li>
                    <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                      85%+ win rate guarantee
                    </li>
                    <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                      Real-time code updates
                    </li>
                    <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                      VIP community access
                    </li>
                    <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                      Premium support
                    </li>
                  </ul>
                </div>

                <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <Shield className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-green-700 dark:text-green-400">
                    Secure payment • 256-bit encryption
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Payment Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-6 h-6 text-blue-500" />
                  Payment Details
                </CardTitle>
                <CardDescription>
                  Enter your payment information securely
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Payment Method Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        type="button"
                        disabled={method.disabled}
                        onClick={() => setSelectedMethod(method.id)}
                        className={`p-3 border-2 rounded-lg text-left transition-all duration-200 ${
                          selectedMethod === method.id
                            ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                            : method.disabled
                            ? 'border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 opacity-50 cursor-not-allowed'
                            : 'border-gray-200 dark:border-gray-600 hover:border-amber-300 cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${method.color}`}>
                            <method.icon className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white text-sm">
                              {method.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {method.description}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Phone Number Input */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    M-Pesa Phone Number
                    <span className="ml-1 text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <span className="text-gray-500">+254</span>
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      maxLength={9}
                      placeholder="712345678"
                      onChange={handlePhoneChange}
                      className={`pl-16 ${
                        !phone ? "border-red-300 focus:border-red-500" : "border-gray-300"
                      }`}
                      disabled={isLoading}
                    />
                  </div>
                  {phone && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      We'll send STK push to: {formatPhoneNumber(phone)}
                    </p>
                  )}
                </div>

                {/* Amount Input */}
                {!isAmountLocked && (
                  <div>
                    <label
                      htmlFor="amount"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Amount (KES)
                      <span className="ml-1 text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <span className="text-gray-500">KES</span>
                      </div>
                      <Input
                        id="amount"
                        type="text"
                        value={amount}
                        placeholder="Enter amount"
                        onChange={handleAmountChange}
                        className="pl-12"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                )}

                {/* Pay Button */}
                <Button
                  onClick={handlePayment}
                  disabled={isLoading || !phone || phone.length < 9 || !amount || Number(amount) <= 0}
                  className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Pay KES {amount}
                    </>
                  )}
                </Button>

                {/* Security Info */}
                <div className="text-center">
                  <Badge 
                    variant="outline" 
                    className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800"
                  >
                    <Shield className="w-3 h-3 mr-1" />
                    Secure & Encrypted
                  </Badge>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Your payment information is secure and encrypted. We never store your sensitive data.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Payment;