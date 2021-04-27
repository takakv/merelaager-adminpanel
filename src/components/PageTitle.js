import React from "react";
import { useSelector } from "react-redux";
import { getTitle } from "../features/pageTitle/pageTitleSlice";

const PageTile = () => {
  const appTitle = useSelector(getTitle);

  return (
    <div className="admin-page__title">
      <h1>{appTitle}</h1>
    </div>
  );
};

export default PageTile;
