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
} from "react-icons/fa";
import { loadUser } from "@/features/slices/authSlice";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

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
    } catch (error) {
      console.log("Failed to update profile.", error.message);
    }
  };

  // Skeleton loader while fetching profile
  if (status === "pending") {
    return (
      <div className="max-w-2xl p-6 mx-auto mt-8 overflow-hidden bg-white shadow-md dark:bg-gray-800 rounded-xl">
        <div className="flex flex-col items-center justify-center mb-8 text-center">
          <Skeleton className="w-24 h-24 bg-gray-200 rounded-full dark:bg-gray-700" />
          <Skeleton className="w-48 h-6 mt-4 bg-gray-200 dark:bg-gray-700" />
          <Skeleton className="w-64 h-4 mt-2 bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="space-y-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="flex items-start space-x-4">
              <Skeleton className="w-6 h-6 mt-1 bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1 space-y-2">
                <Skeleton className="w-32 h-4 bg-gray-200 dark:bg-gray-700" />
                <Skeleton className="w-full h-8 bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!profileData?.user || !profileData?.user?.id) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="max-w-md p-6 text-center bg-white rounded-lg shadow-md dark:bg-gray-800">
          <h3 className="text-lg font-medium text-red-600 dark:text-red-400">
            Error: User profile not found
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            We couldn't load your profile information. Please try refreshing the
            page.
          </p>
          <Button
            onClick={() => {
              dispatch(getUserProfile());
              dispatch(loadUser());
            }}
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl p-6 mx-auto mt-8 overflow-hidden bg-white shadow-md dark:bg-gray-800 rounded-xl">
      {/* Profile Header */}
      <div className="flex flex-col items-center justify-center mb-8 text-center">
        <div className="relative">
          <div className="flex items-center justify-center w-24 h-24 text-3xl font-bold text-white uppercase rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-purple-600">
            {profileData?.user?.name?.[0]?.toUpperCase() || "?"}
          </div>
          <button
            onClick={() => setOpenDialog(true)}
            className="absolute p-2 text-white transition-all bg-blue-600 rounded-full shadow-md -bottom-2 -right-2 hover:bg-blue-700 hover:scale-110"
          >
            <FaEdit className="w-4 h-4" />
          </button>
        </div>
        <h1 className="mt-4 text-2xl font-semibold text-gray-800 dark:text-white">
          Hello,{" "}
          {profileData?.user?.name?.split(" ")[0]?.toUpperCase() || "User"}!
        </h1>
        {profileData?.user?.userType === "client" && (
          <p className="mt-2 text-red-500 dark:text-red-400">
            You don't have any active plan.
          </p>
        )}
        <Link to="/user/vip">Suscribe for vip tips</Link>
      </div>

      {/* Profile Details */}
      <div className="space-y-6">
        <div className="flex items-start space-x-4">
          <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900/50">
            <FaUser className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Name
            </h3>
            <p className="font-medium text-gray-800 dark:text-gray-200">
              {profileData?.user?.name?.toUpperCase()}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900/50">
            <FaEnvelope className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Email
            </h3>
            <p className="font-medium text-gray-800 dark:text-gray-200">
              {profileData?.user?.email}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900/50">
            <FaPhoneAlt className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Phone Number
            </h3>
            <p className="font-medium text-gray-800 dark:text-gray-200">
              {profileData?.user?.phoneNumber}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900/50">
            <FaPhoneAlt className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              VIP Expires in
            </h3>
            {profileData?.user?.userType === "vip" ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {moment(profileData?.user?.accessExpiration).fromNow()}
              </p>
            ) : (
              <p className="font-medium text-gray-800 dark:text-gray-200">
                You don't have any vip packages
              </p>
            )}
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900/50">
            <FaCalendarAlt className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Registered On
            </h3>
            <p className="font-medium text-gray-800 dark:text-gray-200">
              {moment(profileData?.user?.createdAt).format(
                "MMMM Do YYYY @ h:mm:ss a"
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information below. Click save when you're
              done.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSaveChanges}>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                placeholder="Enter your email address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="text"
                value={editPhoneNumber}
                onChange={(e) => setEditPhoneNumber(e.target.value)}
                placeholder="Enter your phone number"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Must start with '07' and be at least 10 digits
              </p>
            </div>
            <div className="flex justify-end pt-4 space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenDialog(false)}
                disabled={status === "pending"}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={status === "pending"}>
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
                    Saving...
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
