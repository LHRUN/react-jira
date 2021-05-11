import React from 'react'
import './App.css'
import { useAuth } from 'context/ahtu-context'
import { AuthenticatedApp } from 'authenticated-app'
import { UnauthenticatedApp } from 'unauthenticated-app'

function App() {
  const { user } = useAuth()

  return (
    <div className="App">
      {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
    </div>
  )
}

export default App
