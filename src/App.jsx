import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import {
  BrowserRouter
} from "react-router-dom";

import { AppRoutes, AppRouter } from "./routes/AppRoutes";
import { AuthProvider } from './context/AuthContext';

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>

        <AppRoutes />

      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;
