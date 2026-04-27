import React from "react";

import {
  Routes,
  Route
} from "react-router-dom";

import Home from "../pages/Home";
import PostDetail from "../pages/PostDetail";

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

    </Routes>

  );

};

export default AppRoutes;