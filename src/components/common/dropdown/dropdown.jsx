import React from "react";

function Dropdown({ label, options, value, onChange }) {
  return (
    <div className="dropdown">
      <label className="dropdownLabel">{label}</label>
      <select className="dropdownSelect" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Dropdown;
