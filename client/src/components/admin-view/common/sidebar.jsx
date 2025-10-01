/* eslint-disable react/prop-types */
import {
  BadgeCheck,
  ChartNoAxesCombined,
  LayoutDashboard,

  Home,
  Image,
  ChevronRight,
  LogOut,

  Wallet,
  Footprints
} from "lucide-react";
import { Fragment } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { logoutUser } from "@/features/slices/authSlice";
import { useDispatch } from "react-redux";

const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    id: "tips",
    label: "Tips Management",
    path: "/admin/tips",
    icon: <Footprints className="w-5 h-5" />,
  },
  {
    id: "payments",
    label: "Payments History",
    path: "/admin/payments",
    icon: <Wallet className="w-5 h-5" />,
  },
  {
    id: "users",
    label: "User Management",
    path: "/admin/users",
    icon: <BadgeCheck className="w-5 h-5" />,
  },
  {
    id: "vips",
    label: "Vips Management",
    path: "/admin/vip",
    icon: <Image className="w-5 h-5" />,
  },
  {
    id: "media",
    label: "Media Library",
    path: "/admin/upload",
    icon: <Image className="w-5 h-5" />,
  },
  
];

const bottomMenuItems = [
  {
    id: "home",
    label: "View Site",
    path: "/user/dashboard",
    icon: <Home className="w-5 h-5" />,
    external: true
  },
];

function MenuItems({ menuItems, setOpen, isMobile }) {
  const navigate = useNavigate();
  const location = useLocation();

  if (!menuItems || menuItems.length === 0) {
    return (
      <div className="flex items-center justify-center p-4">
        <p className="text-sm text-muted-foreground">No menu items available</p>
      </div>
    );
  }

  return (
    <nav className="flex flex-col gap-1">
      {menuItems.map((menuItem) => {
        const isActive = location.pathname.startsWith(menuItem.path);
        return (
          <div
            key={menuItem.id}
            onClick={() => {
              if (menuItem.external) {
                window.open(menuItem.path, '_blank');
              } else {
                navigate(menuItem.path);
              }
              if (isMobile && setOpen) setOpen(false);
            }}
            className={cn(
              "flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-colors cursor-pointer",
              isActive 
                ? "bg-primary/10 text-primary border-l-4 border-primary"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              menuItem.external ? "text-blue-600 hover:text-blue-700" : ""
            )}
          >
            <div className="flex items-center gap-3">
              <span className={cn(
                isActive ? "text-primary" : "text-muted-foreground",
                menuItem.external ? "text-blue-600" : ""
              )}>
                {menuItem.icon}
              </span>
              <span>{menuItem.label}</span>
            </div>
            {menuItem.external && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
          </div>
        );
      })}
    </nav>
  );
}

function AdminSideBar({ open, setOpen }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  
  const handleLogout = () => {
     dispatch(logoutUser());
    navigate("/auth/login"); 
  }

  return (
    <Fragment>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-[280px] p-0">
          <div className="flex flex-col h-full">
            <SheetHeader className="p-6 border-b">
              <SheetTitle className="flex items-center gap-3">
                <ChartNoAxesCombined className="w-6 h-6 text-primary" />
                <span className="text-xl font-bold">Admin Panel</span>
              </SheetTitle>
            </SheetHeader>
            <div className="flex-1 px-4 py-4 overflow-y-auto space-y-6">
              <MenuItems 
                menuItems={adminSidebarMenuItems} 
                setOpen={setOpen} 
                isMobile={true} 
              />
              
              <div className="mt-auto pt-4 border-t">
                <MenuItems 
                  menuItems={bottomMenuItems} 
                  setOpen={setOpen} 
                  isMobile={true} 
                />
              </div>
            </div>
            <div className="p-4 border-t flex flex-col gap-2">
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => {
                  logoutUser();
                  navigate('/login');
                }}
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </Button>
              <div className="text-xs text-muted-foreground text-center">
                v1.0.0
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col fixed h-screen w-[280px] border-r bg-background z-10">
        <div 
          onClick={() => navigate("/admin/dashboard")}
          className="flex items-center gap-3 p-6 transition-colors border-b cursor-pointer hover:bg-accent/50"
        >
          <ChartNoAxesCombined className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>
        <div className="flex-1 px-4 py-4 overflow-y-auto space-y-6">
          <MenuItems 
            menuItems={adminSidebarMenuItems} 
            isMobile={false} 
          />
          
          <div className="mt-auto pt-4 border-t">
            <MenuItems 
              menuItems={bottomMenuItems} 
              isMobile={false} 
            />
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t flex flex-col gap-2">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
           onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </Button>
          <div className="text-xs text-muted-foreground text-center">
            v1.0.0
          </div>
        </div>
      </aside>
    </Fragment>
  );
}

export default AdminSideBar;