"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const SidebarLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
const router = useRouter()
  const tabs = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Products", href: "/products" },
    { name: "Categories", href: "/categories" },
    { name: "Transaction", href: "/transactions" },
  ];

  const handleLogout = () => {
    localStorage.clear();
    router.push("/")
  };

  return (
    <div className="flex h-screen">
      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden p-4 text-gray-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "Close" : "Menu"}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-74 bg-[#85A98F] text-white p-4 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform md:translate-x-0 md:static md:flex-shrink-0`}
      >
        <img src="/pharmacy.jpg" alt="App Logo" className="mx-auto h-16 w-16" />
        <h1 className="text-xl font-bold mb-6">Pharmacy Management System</h1>
        <nav>
          <ul>
            {tabs.map((tab) => (
              <li key={tab.name} className="mb-10">
                <Link
                  href={tab.href}
                  className={`block px-4 py-2 rounded ${
                    pathname === tab.href
                      ? "bg-[#D3F1DF] text-[#85A98F]"
                      : "hover:bg-[#D3F1DF] hover:text-[#85A98F]"
                  }`}
                >
                  {tab.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full mt-6 py-2 bg-[#D3F1DF] rounded hover:bg-[#D3F1DF] text-[#85A98F]"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-0 md:ml-10">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default SidebarLayout;
