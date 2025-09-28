/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getUserProfile, updateProfile } from "@/features/slices/usersSlice";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import {
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaCalendarAlt,
  FaEdit,
  FaCrown,
  FaShieldAlt,
  FaSyncAlt,
} from "react-icons/fa";
import { loadUser } from "@/features/slices/authSlice";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Profile = () => {
  const dispatch = useDispatch();
  const profileData = useSelector((state) => state.users.profileData);
  const status = useSelector((state) => state.users.status);

  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhoneNumber, setEditPhoneNumber] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    dispatch(getUserProfile());
    dispatch(loadUser());
  }, [dispatch]);

  useEffect(() => {
    if (profileData) {
      setEditName(profileData?.user?.name);
      setEditEmail(profileData?.user?.email);
      setEditPhoneNumber(profileData?.user?.phoneNumber);
    }
  }, [profileData]);

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    if (!editName || !editEmail || !editPhoneNumber) {
      toast.error("All fields are required.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(editEmail)) {
      toast.error("Please enter a valid email.");
      return;
    }
    if (editPhoneNumber.length < 10) {
      toast.error("Phone number must be at least 10 digits.");
      return;
    }

    try {
      await dispatch(
        updateProfile({
          formData: {
            name: editName,
            email: editEmail,
            phoneNumber: editPhoneNumber,
          },
        })
      );
      setOpenDialog(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.log("Failed to update profile.", error.message);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const getStatusBadge = () => {
    if (profileData?.user?.userType === "vip") {
      return (
        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1">
          <FaCrown className="w-3 h-3 mr-1" />
          VIP MEMBER
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-gray-600 border-gray-300">
        STANDARD
      </Badge>
    );
  };

  const getExpirationStatus = () => {
    if (profileData?.user?.userType === "vip") {
      const expiration = moment(profileData?.user?.accessExpiration);
      const daysUntilExpiration = expiration.diff(moment(), 'days');
      
      if (daysUntilExpiration <= 7) {
        return (
          <Badge className="bg-red-500 text-white">
            Expires {expiration.fromNow()}
          </Badge>
        );
      } else if (daysUntilExpiration <= 30) {
        return (
          <Badge className="bg-yellow-500 text-white">
            Expires {expiration.fromNow()}
          </Badge>
        );
      }
      return (
        <Badge className="bg-green-500 text-white">
          Active until {expiration.format("MMM Do, YYYY")}
        </Badge>
      );
    }
    return null;
  };

  // Enhanced Skeleton loader
  if (status === "pending") {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-0 shadow-xl">
          <CardContent className="p-8">
            <div className="flex flex-col items-center text-center mb-8">
              <Skeleton className="w-32 h-32 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />
              <Skeleton className="w-64 h-8 mt-6 bg-gray-200 dark:bg-gray-700" />
              <Skeleton className="w-48 h-6 mt-4 bg-gray-200 dark:bg-gray-700" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <Skeleton className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-700" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="w-24 h-4 bg-gray-200 dark:bg-gray-700" />
                    <Skeleton className="w-full h-6 bg-gray-200 dark:bg-gray-700" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profileData?.user || !profileData?.user?.id) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Card className="max-w-md text-center border-0 shadow-2xl bg-gradient-to-br from-white to-red-50 dark:from-gray-800 dark:to-red-900/20">
          <CardContent className="p-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
              <FaShieldAlt className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">
              Profile Unavailable
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We couldn't load your profile information. Please try refreshing the page.
            </p>
            <Button
              onClick={() => {
                dispatch(getUserProfile());
                dispatch(loadUser());
              }}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
            >
              <FaSyncAlt className="w-4 h-4 mr-2" />
              Retry Loading
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Main Profile Card */}
      <Card className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20 border-0 shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full translate-y-12 -translate-x-12"></div>
        
        <CardContent className="relative p-8">
          {/* Profile Header */}
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 mb-8">
            <div className="relative">
              <div className="flex items-center justify-center w-32 h-32 text-4xl font-bold text-white uppercase rounded-full shadow-2xl bg-gradient-to-r from-blue-500 to-purple-600 border-4 border-white dark:border-gray-800">
                {profileData?.user?.name?.[0]?.toUpperCase() || "?"}
              </div>
              <button
                onClick={() => setOpenDialog(true)}
                className="absolute p-3 text-white transition-all bg-gradient-to-r from-blue-600 to-blue-700 rounded-full shadow-lg -bottom-2 -right-2 hover:from-blue-700 hover:to-blue-800 hover:scale-110 hover:shadow-xl"
              >
                <FaEdit className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-1 text-center lg:text-left">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-4">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                  Hello, {profileData?.user?.name?.split(" ")[0]?.toUpperCase() || "User"}!
                </h1>
                {getStatusBadge()}
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-lg">
                {profileData?.user?.email}
              </p>
              
              {profileData?.user?.userType === "client" && (
                <div className="space-y-3">
                  <p className="text-red-500 dark:text-red-400 font-medium">
                    Upgrade to VIP for exclusive tips and features!
                  </p>
                  <Link to="/user/vip">
                    <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg">
                      <FaCrown className="w-4 h-4 mr-2" />
                      Subscribe to VIP
                    </Button>
                  </Link>
                </div>
              )}
              
              {getExpirationStatus()}
            </div>
          </div>

          {/* Profile Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-4 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-100 dark:border-gray-700">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <FaUser className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Full Name
                </h3>
                <p className="font-semibold text-gray-800 dark:text-gray-200">
                  {profileData?.user?.name?.toUpperCase()}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-100 dark:border-gray-700">
              <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-lg">
                <FaEnvelope className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Email Address
                </h3>
                <p className="font-semibold text-gray-800 dark:text-gray-200 break-all">
                  {profileData?.user?.email}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-100 dark:border-gray-700">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                <FaPhoneAlt className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Phone Number
                </h3>
                <p className="font-semibold text-gray-800 dark:text-gray-200">
                  {profileData?.user?.phoneNumber}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-100 dark:border-gray-700">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg">
                <FaCrown className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Membership Status
                </h3>
                {profileData?.user?.userType === "vip" ? (
                  <div className="space-y-1">
                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                      VIP Member
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Expires {moment(profileData?.user?.accessExpiration).format("MMM Do, YYYY")}
                    </p>
                  </div>
                ) : (
                  <p className="font-semibold text-gray-800 dark:text-gray-200">
                    Standard Member
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-100 dark:border-gray-700">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                <FaCalendarAlt className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Member Since
                </h3>
                <p className="font-semibold text-gray-800 dark:text-gray-200">
                  {moment(profileData?.user?.createdAt).format("MMMM Do, YYYY")}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {moment(profileData?.user?.createdAt).fromNow()}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-100 dark:border-gray-700">
              <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-lg">
                <FaShieldAlt className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Account Type
                </h3>
                <p className="font-semibold text-gray-800 dark:text-gray-200 capitalize">
                  {profileData?.user?.userType}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Edit Profile Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[500px] bg-white dark:bg-gray-800 border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Edit Profile
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400 text-base">
              Update your personal information. All fields are required.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-6 mt-4" onSubmit={handleSaveChanges}>
            <div className="space-y-3">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Enter your full name"
                className="h-12 border-2 focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                placeholder="Enter your email address"
                className="h-12 border-2 focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="text"
                value={editPhoneNumber}
                onChange={(e) => setEditPhoneNumber(e.target.value)}
                placeholder="Enter your phone number"
                className="h-12 border-2 focus:border-blue-500 transition-colors"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Must start with '07' and be at least 10 digits
              </p>
            </div>
            <div className="flex justify-end pt-4 space-x-3 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenDialog(false)}
                disabled={status === "pending"}
                className="px-6"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={status === "pending"}
                className="px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
              >
                {status === "pending" ? (
                  <>
                    <svg
                      className="w-4 h-4 mr-2 -ml-1 text-white animate-spin"
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
                    Saving Changes...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;