import React, {useState} from "react";
import "./dropdown.css";
import dropdownIcon from "../../../assets/images/dropdownIcon.png"

function Dropdown({ label, options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };
  
  return (
    <div className="dropdown">
      <label className="dropdownLabel">{label}</label>
      <div className="dropdownWrapper">
        <div className={`dropdownContent ${isOpen ? "selected" : ""}`} onClick={toggleDropdown}>
          <select className="dropdownSelect" value={value} onChange={(e) => onChange(e.target.value)} onBlur={() => setIsOpen(false)}>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <img src={dropdownIcon} alt="Dropdown Icon" className="dropdownIcon" />
        </div>
      </div>
    </div>
  );
}

export default Dropdown;
