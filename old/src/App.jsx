import React from 'react'
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom"
import './App.scss'
import Home from "./pages/home/Home.jsx"
import Game from "./pages/game/Game.jsx"
import Games from "./pages/games/Games.jsx"
import Login from "./pages/login/Login.jsx"
import Register from "./pages/register/Register.jsx"
import Navbar from "./components/navbar/Navbar.jsx"
import Footer from "./components/footer/Footer.jsx"
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

function App() {
  const queryClient = new QueryClient();
  const Layout = () => {
    return (
      <div className="app">
        <QueryClientProvider client={queryClient}>
        <Navbar />
        <Outlet />
        <Footer />
        </QueryClientProvider>
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/game/:id",
          element: <Game />,
        },
        {
          path: "/games",
          element: <Games />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
      ],
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
