import { ReactNode } from 'react'
import { AuthProvider } from './ahtu-context'

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>
}
