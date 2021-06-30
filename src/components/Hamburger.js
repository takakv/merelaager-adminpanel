import React from "react";

const Hamburger = () => {
  const showMenu = ({target}) => {
    // When the button is clicked, show the sidebar.
    const menu = document.getElementsByClassName("c-sidebar")[0];
    menu.classList.add("is-active");

    // Function to close the sidebar and remove the event listener
    // if the click is outside of the sidebar.
    const handleClick = (event) => {
      if (event.target === target) return;
      if ((event.target.closest(".c-sidebar") === null) || event.target.classList.contains("_link")) {
        menu.classList.remove("is-active");
        // Calls itself but breaks after the first call.
        document.removeEventListener("click", handleClick);
      }
    }

    document.addEventListener("click", handleClick);
  };

  return (
    <div className="c-mn">
      <button onClick={showMenu}>Menüü</button>
    </div>
  );
};

export default Hamburger;
