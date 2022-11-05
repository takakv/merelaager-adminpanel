import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setTitle } from "../features/pageTitle/pageTitleSlice";

const useDocumentTitle = (title) => {
  const dispatch = useDispatch();

  useEffect(() => {
    document.title = title;
    dispatch(setTitle(title));
  }, [title]);
};

export default useDocumentTitle;
