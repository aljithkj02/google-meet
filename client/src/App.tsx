import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import { Home } from './pages/Home'
import { Room } from './pages/Room'
import { Viewer } from './pages/Viewer'
import { Layout } from './components/Layout'
import { Provider } from 'react-redux'
import { appStore } from './store/appStore'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/room/:id',
        element: <Room />
      },
      {
        path: '/viewer',
        element: <Viewer />
      }
    ]
  }
])

function App() {

  return (
    <div>
      <Provider store={appStore}>
        <RouterProvider router={router} />
      </Provider>
    </div>
  )
}

export default App
