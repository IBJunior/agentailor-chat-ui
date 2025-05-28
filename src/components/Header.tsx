import React from 'react'
import { PanelLeftClose } from 'lucide-react'
import Link from 'next/link'

interface HeaderProps {
  toggleSidebar: () => void
}
export const Header = ({ toggleSidebar }: HeaderProps) => {
  return (
    <header className=" flex items-center px-4 sticky top-0 z-10 py-3">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="mr-4 p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors cursor-pointer"
            aria-label="Toggle navigation"
          >
            <PanelLeftClose size={25} />
          </button>

          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-semibold text-gray-800 hidden sm:block">
                {'Agentailor'}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
