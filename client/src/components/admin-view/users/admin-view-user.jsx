/** @format */

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import moment from "moment";
import { fetchSingleUser } from "@/features/slices/usersSlice";
import Loader from "@/components/common/Loader";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert } from "@/components/ui/alert";

const AdminViewUser = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.users.user);
  const status = useSelector((state) => state.users.status);
  const error = useSelector((state) => state.users.error);

  useEffect(() => {
    dispatch(fetchSingleUser(userId));
  }, [dispatch, userId]);

  if (status === "pending") {
    return <Loader />;
  }

  if (status === "rejected") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Alert variant="destructive" className="max-w-lg w-full">
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold">Error Fetching User Data</h2>
            <p>{error}</p>
          </div>
        </Alert>
      </div>
    );
  }

  const payments = user?.payments || [];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">User Details</CardTitle>
          <CardDescription>View detailed information about the user.</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Name</p>
            <p className="text-lg text-gray-800">{user?.name || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p className="text-lg text-gray-800">{user?.email || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Phone Number</p>
            <p className="text-lg text-gray-800">{user?.phoneNumber || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">User Type</p>
            <Badge variant="outline" className="text-sm">
              {user?.userType || "N/A"}
            </Badge>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Access Expiration</p>
            <p className="text-lg text-gray-800">
              {user?.accessExpiration
                ? moment(user.accessExpiration).format("MMMM Do YYYY, h:mm:ss a")
                : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Created At</p>
            <p className="text-lg text-gray-800">
              {user?.createdAt
                ? moment(user.createdAt).format("MMMM Do YYYY, h:mm:ss a")
                : "N/A"}
            </p>
          </div>

          {/* Payments Section */}
          <div className="col-span-full mt-6">
            <h3 className="text-xl font-semibold mb-4">Payments</h3>
            {payments.length === 0 ? (
              <p className="text-gray-500">No payments found for this user.</p>
            ) : (
              <div className="space-y-4">
                {payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="p-4 border rounded-md shadow-sm bg-white"
                  >
                    <p>
                      <strong>Amount:</strong> {payment.amount || "N/A"}
                    </p>
                    <p>
                      <strong>Status:</strong> {payment.status || "N/A"}
                    </p>
                    <p>
                      <strong>Reference:</strong> {payment.reference || "N/A"}
                    </p>
                    <p>
                      <strong>Phone Number:</strong> {payment.phoneNumber || "N/A"}
                    </p>
                    <p>
                      <strong>Checkout Request ID:</strong>{" "}
                      {payment.checkoutRequestId || "N/A"}
                    </p>
                    <p>
                      <strong>Mpesa Receipt Number:</strong>{" "}
                      {payment.mpesaReceiptNumber || "N/A"}
                    </p>
                    <p>
                      <strong>Access Expiration:</strong>{" "}
                      {payment.accessExpiration
                        ? moment(payment.accessExpiration).format("MMMM Do YYYY, h:mm:ss a")
                        : "N/A"}
                    </p>
                    <p>
                      <strong>Created At:</strong>{" "}
                      {payment.createdAt
                        ? moment(payment.createdAt).format("MMMM Do YYYY, h:mm:ss a")
                        : "N/A"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminViewUser;
