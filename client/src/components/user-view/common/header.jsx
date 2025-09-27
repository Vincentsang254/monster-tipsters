/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { HousePlug, LogOut, Menu, UserCog, Settings, Bell, HelpCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../../ui/sheet";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../../ui/avatar";
import { useState } from "react";
import { Label } from "../../ui/label";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/features/slices/authSlice";
import { Badge } from "../../ui/badge";

const hardcodedMenuItems = [
  { id: "home", label: "Home", path: "/user/dashboard" },
  { id: "profile", label: "Profile", path: "/user/profile" },
  { id: "premium", label: "Premium Tips", path: "/user/vip" },
  //  { id: "jackpots", label: "Jackpots", path: "/user/jackpots" },
  
];

function MenuItems({ closeSheet }) {
  const navigate = useNavigate();

  function handleNavigate(menuItem) {
    closeSheet();
    navigate(menuItem.path);
  }

  return (
    <nav className="flex flex-col gap-4 mb-3 lg:mb-0 lg:items-center lg:flex-row lg:gap-6">
      {hardcodedMenuItems.map((menuItem) => (
        <Label
          onClick={() => handleNavigate(menuItem)}
          className="px-2 py-1 text-sm font-medium transition-colors rounded-md cursor-pointer hover:text-primary hover:bg-accent"
          key={menuItem.id}
        >
          {menuItem.label}
        </Label>
      ))}
    </nav>
  );
}

function HeaderRightContent() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userType, name } = useSelector((state) => state.auth);

  function handleLogout() {
    dispatch(logoutUser());
  }

  return (
    <div className="flex items-center gap-4">
      

      {/* User Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative w-8 h-8 rounded-full">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="font-bold text-white bg-gradient-to-r from-primary to-secondary">
                {name?.[0]?.toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {name || "Guest User"}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {userType === "admin" ? "Administrator" : "Standard User"}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/user/profile")}>
            <UserCog className="w-4 h-4 mr-2" />
            <span>Profile Settings</span>
          </DropdownMenuItem>
          {userType === "admin" && (
            <DropdownMenuItem onClick={() => navigate("/admin/dashboard")}>
              <Settings className="w-4 h-4 mr-2" />
              <span>Admin Dashboard</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            <span>Log Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function UserHeader() {
  const [openMenuSheet, setOpenMenuSheet] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center justify-between h-16 px-4">
        {/* Left side - Logo and mobile menu */}
        <div className="flex items-center gap-4">
          <Sheet open={openMenuSheet} onOpenChange={setOpenMenuSheet}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="-ml-2 lg:hidden"
                aria-label="Open Menu"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] sm:w-[300px]">
              <div className="flex flex-col h-full">
                <Link 
                  to="/user/dashboard" 
                  className="flex items-center gap-2 mb-8"
                  onClick={() => setOpenMenuSheet(false)}
                >
                  <HousePlug className="w-6 h-6 text-primary" />
                  <span className="text-lg font-bold">Monster Tipsters</span>
                </Link>
                <div className="flex-1">
                  <MenuItems closeSheet={() => setOpenMenuSheet(false)} />
                </div>
                <div className="pb-4 mt-auto">
                  <HeaderRightContent />
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Link to="/user/dashboard" className="flex items-center gap-2">
            <HousePlug className="w-6 h-6 text-primary" />
            <span className="hidden text-lg font-bold sm:inline-block">Monster Tipsters</span>
          </Link>
        </div>

        {/* Center - Desktop Navigation */}
        <div className="items-center justify-center flex-1 hidden mx-8 lg:flex">
          <MenuItems closeSheet={() => setOpenMenuSheet(false)} />
        </div>

        {/* Right side - User controls */}
        <div className="flex items-center gap-2">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}

export default UserHeader;