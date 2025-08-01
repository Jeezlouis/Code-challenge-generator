import React from 'react'
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
import { Outlet, Link, Navigate } from 'react-router-dom'

const Layout = () => {
  return (
    <div className='app-layout'>
      <header className='app-header'>
        <div className='header-content'>
            <h1>Code Challenge Generator</h1>
            <nav>
              <SignedIn>
                <Link to="/">Generate Challenge</Link>
                <Link to="/history">history</Link>
                <UserButton />
              </SignedIn>
            </nav>
        </div>
      </header>
      <div className='app-main'>
        <SignedOut>
          <Navigate to="/sign-in" replace/>
        </SignedOut>
        <SignedIn>
          <Outlet />
        </SignedIn>
      </div>
      
    </div>
  )
}

export default Layout