import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from '../shared/hooks/AuthContext'
import { NavigationProvider } from '../shared/hooks/NavigationContext'
import router from './router/router'

const App = () => {
  return (
    <AuthProvider>
      <NavigationProvider>
        <RouterProvider router={router} />
      </NavigationProvider>
    </AuthProvider>
  )
}

export default App