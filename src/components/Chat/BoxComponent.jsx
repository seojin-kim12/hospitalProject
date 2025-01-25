import React from "react";

const BoxComponent = ({ as: Component = "div", children, ...props }) => {
  return <Component {...props}>{children}</Component>;
};

export default BoxComponent;