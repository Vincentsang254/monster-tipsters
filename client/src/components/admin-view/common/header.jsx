/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { AlignJustify, LogOut, Home, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

import { logoutUser } from "@/features/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function AdminHeader({ setOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
   const {  name } = useSelector((state) => state.auth);

  function handleLogout() {
    dispatch(logoutUser());
    navigate("/auth/login"); // Navigate to login page after logout
  }

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-3 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      {/* Left Section - Menu Button */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <Button
          onClick={() => setOpen(true)}
          variant="ghost"
          size="icon"
          className="lg:hidden hover:bg-accent"
        >
          <AlignJustify className="w-5 h-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>

        {/* Home Button */}
        <Button
          onClick={() => navigate("/admin/dashboard")}
          variant="ghost"
          size="icon"
          className="hidden sm:flex hover:bg-accent"
          aria-label="Home"
        >
          <Home className="w-5 h-5" />
        </Button>
      </div>

      {/* Right Section - User Controls */}
      <div className="flex items-center gap-4">
        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative w-8 h-8 rounded-full hover:bg-accent"
            >
              <Avatar className="w-8 h-8">
                <AvatarImage src="/avatars/admin.png" alt="Admin" />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {name?.[0]?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuItem
              onClick={() => navigate("/admin/dashboard")}
              className="cursor-pointer"
            >
              <User className="w-4 h-4 mr-2" />
              <span>Profile</span>
            </DropdownMenuItem>
   
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default AdminHeader;