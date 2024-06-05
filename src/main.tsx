import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// 使用 lazy 加载页面组件
const Home = lazy(() => import('./pages/home.tsx'));
const App = lazy(() => import('./components/App'));
const Courses = lazy(() => import('./pages/Course'));
const Photography = lazy(() => import('./pages/Photography'));
const Graphics = lazy(() => import('./pages/Graphics'));
const Blog = lazy(() => import('./pages/Blog'));
const About = lazy(() => import('./pages/About'));
const ErrorPage = lazy(() => import("./pages/error_page.tsx"));
const SingleBlog = lazy(() => import('./pages/singleblog.tsx'));

import { Analytics } from "@vercel/analytics/react";

// 定义路由
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
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

// 渲染应用
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={router} />
      <Analytics />
    </Suspense>
  </React.StrictMode>
);