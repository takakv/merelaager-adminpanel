import React from "react";
import { useSelector } from "react-redux";
import { getTitle } from "../features/pageTitle/pageTitleSlice";

const PageTile = () => {
  const appTitle = useSelector(getTitle);

  return (
    <div className="admin-page__title">
      <span>{appTitle}</span>
    </div>
  );
};

export default PageTile;
