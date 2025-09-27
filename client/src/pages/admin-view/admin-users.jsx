import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  deleteUser,
  fetchUsers,
  updateUser,
} from "@/features/slices/usersSlice";
import Loader from "@/components/common/Loader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FaEdit, FaTrashAlt, FaUserShield, FaUserTie, FaUser } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const AdminUsers = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.list);
  const status = useSelector((state) => state.users.status);
  const error = useSelector((state) => state.users.error);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    userType: "",
    password: "",
  });
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        name: selectedUser.name,
        email: selectedUser.email,
        phoneNumber: selectedUser.phoneNumber,
        userType: selectedUser.userType,
        password: "",
      });
    }
  }, [selectedUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phoneNumber || !formData.userType) {
      toast.error("Please fill all required fields", { position: "top-center" });
      return;
    }

    try {
      if (selectedUser) {
        const dataToUpdate = { ...formData };
        if (!formData.password) delete dataToUpdate.password;
        
        await dispatch(updateUser({ userId: selectedUser.id, formData: dataToUpdate })).unwrap();
        setSelectedUser(null);
        dispatch(fetchUsers());
      }
    } catch (error) {
      toast.error(error?.message || "Failed to update user", { position: "top-center" });
    }
  };

  const handleDelete = async () => {
    if (confirmDelete) {
      try {
        await dispatch(deleteUser(confirmDelete.id)).unwrap();

        setConfirmDelete(null);
        dispatch(fetchUsers());
      } catch (error) {
        toast.error(error?.message || "Failed to delete user", { position: "top-center" });
      }
    }
  };

  const getUserIcon = (userType) => {
    switch(userType) {
      case 'admin': return <FaUserShield className="text-purple-600" />;
      case 'vip': return <FaUserTie className="text-yellow-600" />;
      default: return <FaUser className="text-blue-600" />;
    }
  };

  const getUserBadge = (userType) => {
    const variantMap = {
      admin: "destructive",
      client: "default",
      vip: "secondary",

    };

    return (
      <Badge variant={variantMap[userType] || "default"} className="capitalize">
        {getUserIcon(userType)}
        <span className="ml-1.5">{userType}</span>
      </Badge>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">User Management</h1>
      </div>

      {status === "pending" && <Loader className="my-12" />}
      
      {status === "rejected" && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-center">
          Error: {error}
        </div>
      )}

      {status === "success" && users.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <Table className="min-w-full">
            <TableHeader className="bg-gray-50 dark:bg-gray-700">
              <TableRow>
                <TableHead className="w-[200px]">Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-600 flex items-center justify-center">
                        <span className="text-gray-600 dark:text-gray-300">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-gray-900 dark:text-white font-medium">{user.name}</p>
                        <p className="text-gray-500 text-sm">ID: {user.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-300">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    {user.phoneNumber || <span className="text-gray-400">Not set</span>}
                  </TableCell>
                  <TableCell>
                    {getUserBadge(user.userType)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Link
                        to={`/admin/view/user/${user.id}`}
                        className="p-2 text-gray-500 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30"
                        title="View"
                      >
                        <AiOutlineEye size={18} />
                      </Link>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <button
                            className="p-2 text-gray-500 hover:text-green-600 transition-colors rounded-full hover:bg-green-50 dark:hover:bg-green-900/30"
                            title="Edit"
                            onClick={() => setSelectedUser(user)}
                          >
                            <FaEdit size={16} />
                          </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>Edit User</DialogTitle>
                            <DialogDescription>
                              Update user details below. Changes will be saved immediately.
                            </DialogDescription>
                          </DialogHeader>
                          <form className="space-y-4 py-4" onSubmit={handleSave}>
                            <div className="space-y-2">
                              <Label htmlFor="name">Full Name</Label>
                              <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="email">Email</Label>
                              <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="phoneNumber">Phone Number</Label>
                              <Input
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="userType">User Role</Label>
                              <Select
                                name="userType"
                                value={formData.userType}
                                onValueChange={(value) => setFormData({...formData, userType: value})}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="admin">Admin</SelectItem>
                                  <SelectItem value="client">Client</SelectItem>
                                  <SelectItem value="vip">VIP</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="password">New Password (Optional)</Label>
                              <Input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Leave blank to keep current"
                              />
                            </div>
                            
                            <div className="flex justify-end gap-4 pt-4">
                              <Button
                                variant="outline"
                                type="button"
                                onClick={() => setSelectedUser(null)}
                              >
                                Cancel
                              </Button>
                              <Button type="submit">Save Changes</Button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <button
                            className="p-2 text-gray-500 hover:text-red-600 transition-colors rounded-full hover:bg-red-50 dark:hover:bg-red-900/30"
                            title="Delete"
                            onClick={() => setConfirmDelete(user)}
                          >
                            <FaTrashAlt size={16} />
                          </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Confirm Deletion</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete <strong>{user.name}</strong>? This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex justify-end gap-4 pt-4">
                            <Button
                              variant="outline"
                              onClick={() => setConfirmDelete(null)}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={handleDelete}
                            >
                              Delete User
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : status === "success" && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center border border-dashed border-gray-200 dark:border-gray-700">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
            <FaUser className="h-5 w-5 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No users found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Get started by creating a new user.
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;