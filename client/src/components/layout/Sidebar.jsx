import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

const Sidebar = () => {
  const { user } = useAuth()

  const getNavItems = () => {
    switch (user?.role) {
      case 'teacher':
        return [
          { name: 'Dashboard', href: '/dashboard', icon: '📊' },
          { name: 'Upload Evaluation', href: '/upload', icon: '📤' },
          { name: 'Results', href: '/results', icon: '📋' },
        ]
      case 'student':
        return [
          { name: 'Dashboard', href: '/dashboard', icon: '📊' },
          { name: 'My Results', href: '/results', icon: '📋' },
          { name: 'Analytics', href: '/analytics', icon: '📈' },
          { name: 'AI Tutor', href: '/ai-tutor', icon: '🤖' },
        ]
      case 'parent':
        return [
          { name: 'Dashboard', href: '/dashboard', icon: '📊' },
        ]
      case 'trainer':
        return [
          { name: 'Dashboard', href: '/dashboard', icon: '📊' },
        ]
      default:
        return []
    }
  }

  const navItems = getNavItems()

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-indigo-800">
        <div className="flex items-center flex-shrink-0 px-4">
          <h1 className="text-white text-xl font-bold">Evalora AI</h1>
        </div>
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="text-indigo-100 hover:bg-indigo-700 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}

export default Sidebar
