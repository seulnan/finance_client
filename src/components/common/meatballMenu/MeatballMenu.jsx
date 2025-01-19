import React, { useState, useEffect, useRef } from "react";
import "./MeatballMenu.css";
import meatballIcon from "../../../assets/images/meatballMenu.png"
const MeatballMenu = ({ onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const handleOutsideClick = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="MeatballMenu" ref={menuRef}>
      <button className="MenuButton" onClick={toggleMenu}>
        <img src={meatballIcon} alt="Meatball Menu" />
      </button>
      {isOpen && (
        <div className="MenuDropdown">
          <button onClick={onEdit} className="EditButton">Edit Budget</button>
          <hr />
          <button onClick={onDelete} className="DeleteButton">Delete Budget</button>
        </div>
      )}
    </div>
  );
};

export default MeatballMenu;
