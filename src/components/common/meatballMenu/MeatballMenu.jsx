import React, { useState, useEffect, useRef } from "react";
import "./MeatballMenu.css";
import meatballIcon from "../../../assets/images/meatBallMenu.svg"; 

const MeatballMenu = ({ onEdit, onDelete, source }) => {
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

  // ✅ source 값에 따라 버튼 텍스트 결정
  const editText = source === "Pots" ? "Edit Pot" : "Edit Budget";
  const deleteText = source === "Pots" ? "Delete Pot" : "Delete Budget";

  return (
    <div className="MeatballMenu" ref={menuRef}>
      <button className="MenuButton" onClick={toggleMenu}>
        <img src={meatballIcon} alt="Meatball Menu" />
      </button>
      {isOpen && (
        <div className="MenuDropdown">
          <button onClick={onEdit} className="EditButton">{editText}</button>
          <hr />
          <button onClick={onDelete} className="DeleteButton">{deleteText}</button>
        </div>
      )}
    </div>
  );
};

export default MeatballMenu;
