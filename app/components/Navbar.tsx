"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Settings, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: Home,
    },
    {
      name: "Setup",
      href: "/setup",
      icon: Settings,
    },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="border-b border-purple-500/30 sticky top-0 z-50 bg-black/80 backdrop-blur-md shadow-lg shadow-purple-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 via-purple-500 to-orange-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-all duration-300 group-hover:scale-110">
                <span className="text-xl animate-pulse">👻</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-white font-bold text-xl group-hover:text-purple-300 transition-colors duration-300">
                  Lil Ghost
                </span>
                <div className="text-purple-400 text-xs opacity-80">
                  Smart Home Control
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105
                      ${
                        active
                          ? "bg-purple-600/40 text-white shadow-lg border border-purple-400/60 shadow-purple-500/20"
                          : "text-gray-200 hover:text-white hover:bg-purple-600/20 hover:border hover:border-purple-400/40 hover:shadow-lg hover:shadow-purple-500/10"
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                    {active && <span className="text-xs animate-pulse">👻</span>}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-purple-600/20 transition-all duration-300 hover:scale-110"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-purple-500/30 bg-black/60 backdrop-blur-sm">
            <div className="px-2 pt-2 pb-3 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-all duration-300
                      ${
                        active
                          ? "bg-purple-600/40 text-white border border-purple-400/60 shadow-lg shadow-purple-500/20"
                          : "text-gray-200 hover:text-white hover:bg-purple-600/20 hover:border hover:border-purple-400/40"
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                    {active && <span className="text-sm animate-pulse">👻</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
      
      {/* Subtle floating animation */}
      <div className="absolute top-2 right-20 text-xs opacity-20 animate-bounce hidden lg:block" style={{ animationDuration: '4s' }}>
        🦇
      </div>
    </nav>
  );
}