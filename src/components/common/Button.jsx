import React from "react";

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`btn ${variant}`}
    >
      {children}
    </button>
  );
};

export default Button;