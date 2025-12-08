import { 
  MagnifyingGlassIcon,
  BellIcon,
  Bars3Icon,
  ChevronDownIcon,
  UserIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'
import { useState, useRef, useEffect } from 'react'

const Navbar = ({ sidebarOpen, toggleSidebar }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const handleLogout = () => {
    // Add logout logic here
    alert('Logged out successfully!')
    setIsDropdownOpen(false)
  }

  const handleProfile = () => {
    // Navigate to profile page
    alert('Navigate to profile page')
    setIsDropdownOpen(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm">
      {/* Mobile Hamburger Icon - Left side */}
      <div className="flex items-center lg:hidden">
        <button
          onClick={toggleSidebar}
          className="text-gray-500 hover:text-gray-700"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
      </div>

      {/* Search Bar - Centered on mobile, full width on desktop */}
      <div className="flex-1 mx-4 max-w-2xl">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="search"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-10 pr-4 text-sm placeholder-gray-500 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            placeholder="Search for products, orders, users..."
          />
        </div>
      </div>

      {/* Right side: Icons and User */}
      <div className="flex items-center space-x-3">
        {/* Notifications - Hidden on mobile, visible on tablet and up */}
        <button className="hidden md:flex relative rounded-full p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100">
          <BellIcon className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
            3
          </span>
        </button>

        {/* Mobile notification bell (simpler) */}
        <button className="md:hidden relative rounded-full p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100">
          <BellIcon className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-red-500"></span>
        </button>

        {/* User dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={toggleDropdown}
            className="flex items-center space-x-2 rounded-full p-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <div className="relative">
              <img
                className="h-8 w-8 rounded-full border-2 border-gray-200"
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
                alt="User"
              />
              <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
            </div>
            {/* Hide dropdown chevron on mobile, show on desktop */}
            <ChevronDownIcon className={`hidden md:block h-4 w-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
              {/* User info */}
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500 truncate">admin@example.com</p>
                <div className="mt-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    Administrator
                  </span>
                </div>
              </div>
              
              {/* Dropdown items */}
              <div className="py-1">
                <button
                  onClick={handleProfile}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <UserIcon className="h-4 w-4 mr-3 text-gray-400" />
                  <div className="text-left">
                    <div className="font-medium">My Profile</div>
                    <div className="text-xs text-gray-500">View and edit your profile</div>
                  </div>
                </button>
                
                <div className="border-t border-gray-100 my-1"></div>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Logout</div>
                    <div className="text-xs text-red-500">Sign out from your account</div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar