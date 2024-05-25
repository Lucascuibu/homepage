import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import App from './App.tsx';
import Courses from './Course.tsx';
import Photography from './Photography.tsx';
import Graphics from './Graphics.tsx';
import Blog from './Blog.tsx';
import About from './About.tsx';
import ErrorPage from "./error_page";
import SingleBlog from './singleblog';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/graphics",
    element: <Graphics />,
  },
  {
    path: "/photography",
    element: <Photography />,
  },
  {
    path: "/courses",
    element: <Courses />,
  },
  {
    path: "/blogs",
    element: <Blog />,
  },
  {
    path: '/blog/*',
    element: <SingleBlog />,
  },
  {
    path: "/about",
    element: <About />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);