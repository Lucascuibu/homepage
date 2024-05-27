import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Home from './home.tsx';
import App from './App.tsx';
import Courses from './Course.tsx';
import Photography from './Photography.tsx';
import Graphics from './Graphics.tsx';
import Blog from './Blog.tsx';
import About from './About.tsx';
import ErrorPage from "./error_page";
import SingleBlog from './singleblog';

import { Analytics } from "@vercel/analytics/react"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true, // 设置默认路由
        element: <Home />,
      },
      {
        path: "graphics",
        element: <Graphics />,
      },
      {
        path: "photography",
        element: <Photography />,
      },
      {
        path: "courses",
        element: <Courses />,
      },
      {
        path: "blogs",
        element: <Blog />,
      },
      {
        path: "blog/*",
        element: <SingleBlog />,
      },
      {
        path: "about",
        element: <About />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <Analytics />
  </React.StrictMode>,
);