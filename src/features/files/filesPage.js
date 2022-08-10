import { useDispatch } from "react-redux";
import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { setTitle } from "../pageTitle/pageTitleSlice";

const handleDragOver = (e) => {
  e.preventDefault();
  e.stopPropagation();
};

const handleDrop = (e) => {
  e.preventDefault();
  e.stopPropagation();

  const { files } = e.dataTransfer;

  if (files && files.length) {
    console.log(files);
  }
};

const DragDropArea = () => {
  const dropRef = useRef(null);

  useEffect(() => {
    dropRef.current.addEventListener("dragover", handleDragOver);
    dropRef.current.addEventListener("drop", handleDrop);

    return () => {
      dropRef.current.removeEventListener("dragover", handleDragOver);
      dropRef.current.removeEventListener("drop", handleDrop);
    };
  }, []);

  return (
    <div className="c-dragdrop" ref={dropRef}>
      Laadi üles
    </div>
  );
};

const MyFiles = () => {
  return (
    <div>
      <p>Minu failid</p>
    </div>
  );
};

const SubmissionBox = () => {
  return (
    <div>
      <p>Submission box</p>
      <DragDropArea />
    </div>
  );
};

const FilesPage = ({ title }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setTitle(title));
  }, [title, dispatch]);

  return (
    <div>
      <h4>See veel ei toimi</h4>
      <MyFiles />
      <SubmissionBox />
    </div>
  );
};

FilesPage.propTypes = {
  title: PropTypes.string.isRequired,
};

export default FilesPage;
