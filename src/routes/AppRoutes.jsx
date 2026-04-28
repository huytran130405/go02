import React from "react";

import {
  Routes,
  Route
} from "react-router-dom";

import Home from "../pages/Home";
import PostDetail from "../pages/PostDetail";
import Login from "../pages/Login";
import Register from "../pages/Register";
import CreatePost from "../pages/CreatePost";

const AppRoutes = () => {

  return (

    <Routes>

      {/* Home */}
      <Route
        path="/"
        element={<Home />}
      />

      {/* Post Detail */}
      <Route
        path="/post/:id"
        element={<PostDetail />}
      />

      {/* Login */}
      <Route
        path="/login"
        element={<Login />}
      />

      {/* Register */}
      <Route
        path="/register"
        element={<Register />}
      />

      {/* Create Post */}
      <Route
        path="/create-post"
        element={<CreatePost />}
      />

    </Routes>

  );

};

export default AppRoutes;