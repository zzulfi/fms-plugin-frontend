import { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react'
import { LucideIcon } from 'lucide-react'

interface NavItem {
  id: string
  name: string
  icon: LucideIcon
}

interface NavigationContextType {
  navItems: NavItem[]
  setNavItems: (items: NavItem[]) => void
  activeTab: string
  setActiveTab: (tab: string) => void
  setActiveTabHandler: (handler: (tab: string) => void) => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

export const useNavigation = () => {
  const context = useContext(NavigationContext)
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
}

interface NavigationProviderProps {
  children: ReactNode
}

export const NavigationProvider = ({ children }: NavigationProviderProps) => {
  const [navItems, setNavItems] = useState<NavItem[]>([])
  const [activeTab, setActiveTab] = useState<string>('')
  const [activeTabHandler, setActiveTabHandler] = useState<((tab: string) => void) | null>(null)

  const handleSetActiveTab = useCallback((tab: string) => {
    setActiveTab(tab)
    if (activeTabHandler) {
      activeTabHandler(tab)
    }
  }, [activeTabHandler])

  const handleSetActiveTabHandler = useCallback((handler: (tab: string) => void) => {
    setActiveTabHandler(() => handler)
  }, [])

  const contextValue = useMemo(() => ({
    navItems,
    setNavItems,
    activeTab,
    setActiveTab: handleSetActiveTab,
    setActiveTabHandler: handleSetActiveTabHandler
  }), [navItems, activeTab, handleSetActiveTab, handleSetActiveTabHandler])

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  )
}