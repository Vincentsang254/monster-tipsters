/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import axios from "axios";
import { setHeaders, url } from "@/features/slices/api";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "@/features/slices/authSlice";

const Payment = () => {
  const { amount: paramAmount } = useParams();
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAmountLocked, setIsAmountLocked] = useState(false);
  const dispatch = useDispatch();
  const { name, id } = useSelector((state) => state.auth);

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
          phone, 
          amount, 
          name,
          id
        },
        setHeaders()
      );
      console.log("pay response", response.data)
      toast.success(response.data.message, { position: "top-center" });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Payment failed. Please try again.",
        { position: "top-center" }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "");
    setPhone(digits);
  };

  const handleAmountChange = (e) => {
    if (!isAmountLocked) {
      setAmount(e.target.value);
    }
  };

  return (
    <div className="max-w-md p-8 mx-auto my-10 bg-white rounded-lg shadow-lg dark:bg-gray-800">
      <div className="flex flex-col items-center mb-6">
        <div className="p-3 mb-4 bg-green-100 rounded-full dark:bg-green-900/30">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 text-green-600 dark:text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
          M-Pesa Payment
        </h1>
        <p className="mt-2 text-center text-gray-600 dark:text-gray-300">
          Complete your payment securely via M-Pesa
        </p>
        {isAmountLocked && (
          <p className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
            Fixed amount: KES {amount}
          </p>
        )}
      </div>

      <div className="space-y-6">
        {/* Phone Number Input */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Phone Number
            <span className="ml-1 text-red-500">*</span>
          </label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-gray-500">+254</span>
            </div>
            <Input
              id="phone"
              type="tel"
              value={phone}
              maxLength={10}
              placeholder="712345678"
              onChange={handlePhoneChange}
              className={`pl-16 ${!phone ? "border-red-500" : "border-gray-300"}`}
            />
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Enter your M-Pesa registered number (e.g., 712345678)
          </p>
        </div>

        {/* Amount Input */}
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Amount (KES)
            <span className="ml-1 text-red-500">*</span>
          </label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-gray-500">KES</span>
            </div>
            <Input
              id="amount"
              type="number"
              value={amount}
              min="1"
              placeholder={isAmountLocked ? "" : "Enter amount"}
              disabled={isAmountLocked || isLoading}
              onChange={handleAmountChange}
              className={`pl-12 ${
                !amount || Number(amount) <= 0
                  ? "border-red-500"
                  : "border-gray-300"
              } ${isAmountLocked ? "bg-gray-100 dark:bg-gray-700" : ""}`}
            />
            {isAmountLocked && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>
          {amount && Number(amount) > 0 && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {isAmountLocked 
                ? "This amount cannot be changed" 
                : "You'll receive an M-Pesa push notification"}
            </p>
          )}
        </div>

        {/* Pay Now Button */}
        <Button
          disabled={isLoading || !phone || !amount || Number(amount) <= 0}
          className="w-full py-6 text-lg font-medium text-white transition-colors duration-300 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          onClick={handlePayment}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg
                className="w-5 h-5 mr-2 -ml-1 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {isAmountLocked ? "Processing Payment..." : "Pay Now"}
            </div>
          ) : (
            `Pay KES ${amount}`
          )}
        </Button>

        {/* Security Info */}
        <div className="flex items-start p-3 mt-4 text-sm bg-gray-100 rounded-lg dark:bg-gray-700/50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="flex-shrink-0 w-5 h-5 mr-2 text-green-600 dark:text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <span className="text-gray-600 dark:text-gray-300">
            Your payment is secure and encrypted. We don't store your payment
            details.
          </span>
        </div>
      </div>
    </div>
  );
};

export default Payment;