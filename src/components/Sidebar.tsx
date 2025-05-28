import React, { useEffect } from 'react'
import {PanelLeftClose, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface SidebarProps {
  isOpen: boolean
  toggle: () => void
  children?: React.ReactNode
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggle, children }) => {
  // Close sidebar on escape key press
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) toggle()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, toggle])

  return (
    <>
      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          x: isOpen ? 0 : -256, // 256px = w-64
          width: isOpen ? 256 : 0,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`fixed md:sticky top-0 left-0 h-screen bg-white border-r border-gray-100 z-30 overflow-hidden ${
          isOpen ? 'flex' : 'hidden md:flex'
        }`}
      >
        <div className="w-64 p-5 h-full flex flex-col overflow-hidden flex-shrink-0">
          <div className="flex items-center justify-between mb-6">
          
            <button
              onClick={toggle}
              className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer md:hidden"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto">
            {children}
          </div>
        </div>
      </motion.div>

      {/* Menu Toggle Button - Only show on mobile */}
      <button
        onClick={toggle}
        className={`fixed top-4 left-4 z-40 p-2 rounded-md transition-all duration-300 cursor-pointer md:hidden
          ${
            isOpen
              ? 'opacity-0 pointer-events-none'
              : 'opacity-100 bg-white shadow-sm hover:bg-gray-50 border border-gray-200'
          }`}
        aria-label="Toggle navigation"
      >
        <PanelLeftClose size={20} />
      </button>

      {/* Overlay Background - Only show on mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 md:hidden"
            onClick={toggle}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default Sidebar
