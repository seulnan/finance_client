import React from "react";
import "./dropdown.css";
import dropdownIcon from "../../../assets/images/dropdownIcon.png";

function Dropdown({ label, options, value, onChange }) {
  return (
    <div className="dropdown">
      <label className="dropdownLabel">{label}</label>
      <div className="dropdownWrapper">
        <select
          className="dropdownSelect"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <img
          src= {dropdownIcon}
          alt="Dropdown Icon"
          className="dropdownIcon"
        />
      </div>
    </div>
  );
}

export default Dropdown;
