import React, { useState, useEffect } from "react";
import baseAxios from "../../../baseAxios.js";
import SearchField from "../searchField/SearchField.jsx";
import "../budgetModal/BudgetModal.css";

import "../../../styles/colors.css";

import Dropdowncross from '../../../assets/images/dropdowncross.svg';

const GetColorVariable = (color) => {
  const colorMap = {
    Green: "var(--green)",
    Yellow: "var(--yellow)",
    Cyan: "var(--cyan)",
    Navy: "var(--navy)",
    Red: "var(--red)",
    Purple: "var(--purple)",
    Turquoise: "var(--turquoise)",
    Brown: "var(--brown)",
    Magenta: "var(--magenta)",
    Blue: "var(--blue)",
    Grey: "var(--grey-500)",
    Army: "var(--army-green)",
    Pink: "var(--magenta)",
    Gold: "var(--gold)",
    Orange: "var(--orange)",
  };
  return colorMap[color] || "var(--grey-300)";
};

const BudgetModal = ({ type, budget, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    category: "",
    theme: "",
    limit: "",
  });
  const [options, setOptions] = useState({
    availableCategories: [],
    usedCategories: [],
    availableColors: [],
    usedColors: [],
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (type === "add") {
      fetchOptions();
    } else if (type === "edit" && budget) {
      setFormData({
        category: budget.name,
        theme: budget.color,
        limit: budget.limit,
      });
      fetchOptions();
    }
  }, [type, budget]);

  const fetchOptions = async () => {
    try {
      const response = await baseAxios.get("/api/budget/available-options");
      setOptions(response.data);
    } catch (error) {
      console.error("Failed to fetch options:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleThemeSelection = (color) => {
    setFormData({ ...formData, theme: color }); // ✅ 색상 이름 그대로 저장
    setDropdownOpen(false);
  };
  
  const handleSubmit = async () => {
    try {
      if (type === "add") {
        await baseAxios.post("/api/budget", {
          name: formData.category,
          color: formData.theme,
          limit: parseFloat(formData.limit),
        });
      } else if (type === "edit") {
        await baseAxios.patch(`/api/budget/${budget._id}`, {
          color: formData.theme,
          limit: parseFloat(formData.limit),
        });
      }
      onSuccess();
    } catch (error) {
      console.error("Failed to save budget:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await baseAxios.delete(`/api/budget/${budget._id}`);
      onSuccess();
    } catch (error) {
      console.error("Failed to delete budget:", error);
    }
  };

  return (
    <div className="Modal">
      <div className="ModalContent">
        <div className="ModalHeader">
          <h2>
            {type === "add"
              ? "Add New Budget"
              : type === "edit"
              ? "Edit Budget"
              : `Delete ‘${budget.name}’`}
          </h2>
          <button className="CloseButton" onClick={onClose}></button>
        </div>

        {type === "add" && (
          <>
            <p>
              Choose a category to set a spending budget. These categories can
              help you monitor spending.
            </p>
            <div className="FormGroup">
              <label>Budget Category</label>
              <select name="category" onChange={handleInputChange} value={formData.category}>
                <option value="">Select Category</option>
                {options.usedCategories.map((category) => (
                  <option key={category} value={category} disabled>
                    {category} (Already Used)
                  </option>
                ))}
                {options.availableCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="FormGroup">
              <label>Maximum Spend</label>
              <SearchField
                type="icon-left"
                placeholder="e.g. 2000"
                value={formData.limit}
                onChange={(e) =>
                  setFormData({ ...formData, limit: e.target.value })
                }
              />
            </div>

            <div className="FormGroup">
              <label>Theme</label>
              <div className="ColorDropdown">
                <div className="DropdownHeader">
                  <div onClick={() => setDropdownOpen(!dropdownOpen)} style={{ display: "flex", alignItems: "center", width: "100%" }}>
                    {formData.theme ? (
                      <>
                        <span className="ColorCircle" style={{ backgroundColor: GetColorVariable(formData.theme) }}></span>
                        {formData.theme}
                      </>
                    ) : (
                      "Select Theme"
                    )}
                  </div>
                  <img 
                    src={Dropdowncross} 
                    alt="Toggle Dropdown" 
                    className={`DropdownCloseIcon ${dropdownOpen ? "visible" : "hidden"}`} 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  />
                </div>
                
                {dropdownOpen && (
                  <div className="DropdownList">
                    {options.usedColors.map((color) => (
                      <div 
                        key={`used-${color}`} 
                        className="DropdownOption Disabled" 
                        onClick={() => handleThemeSelection(color)}
                      >
                        <span 
                          className="ColorCircle" 
                          style={{ backgroundColor: GetColorVariable(color) }} // ✅ CSS 변수 변환 후 적용
                        ></span> 
                        {color} (Already Used)
                      </div>
                    ))}
                    {options.availableColors.map((color) => (
                      <div 
                        key={`available-${color}`} 
                        className="DropdownOption" 
                        onClick={() => handleThemeSelection(color)}
                      >
                        <span 
                          className="ColorCircle" 
                          style={{ backgroundColor: GetColorVariable(color) }} // ✅ CSS 변수 변환 후 적용
                        ></span> 
                        {color}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button className="ModalSubmitButton" onClick={handleSubmit}>
              Add Budget
            </button>
          </>
        )}

        {type === "edit" && (
          <>
            <p>As your budgets change, feel free to update your spending limits.</p>
            <div className="FormGroup">
              <label>Budget Category</label>
              <input type="text" value={formData.category} disabled />
            </div>

            <div className="FormGroup">
              <label>Maximum Spend</label>
              <SearchField
                type="icon-left"
                placeholder="e.g. 2000"
                value={formData.limit}
                onChange={(e) =>
                  setFormData({ ...formData, limit: e.target.value })
                }
              />
            </div>

            <div className="FormGroup">
              <label>Theme</label>
              <div className="ColorDropdown">
              <div className="DropdownHeader">
                <div 
                  onClick={() => setDropdownOpen(!dropdownOpen)} 
                  style={{ display: "flex", alignItems: "center", width: "100%" }}
                >
                  {formData.theme ? (
                    <>
                      <span className="ColorCircle" style={{ backgroundColor: GetColorVariable(formData.theme) }}></span>
                      {formData.theme}
                    </>
                  ) : (
                    "Select Theme"
                  )}
                </div>
                  <img 
                    src={Dropdowncross} 
                    alt="Toggle Dropdown" 
                    className={`DropdownCloseIcon ${dropdownOpen ? "visible" : "hidden"}`} 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  />
                </div>
                {dropdownOpen && (
                  <div className="DropdownList">
                    {options.usedColors.map((color) => (
                      <div 
                        key={`used-${color}`} 
                        className="DropdownOption Disabled" 
                        onClick={() => handleThemeSelection(color)}
                      >
                        <span 
                          className="ColorCircle" 
                          style={{ backgroundColor: GetColorVariable(color) }} // ✅ CSS 변수 변환 후 적용
                        ></span> 
                        {color} (Already Used)
                      </div>
                    ))}
                    {options.availableColors.map((color) => (
                      <div 
                        key={`available-${color}`} 
                        className="DropdownOption" 
                        onClick={() => handleThemeSelection(color)}
                      >
                        <span 
                          className="ColorCircle" 
                          style={{ backgroundColor: GetColorVariable(color) }} // ✅ CSS 변수 변환 후 적용
                        ></span> 
                        {color}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button className="ModalSubmitButton" onClick={handleSubmit}>
              Save Changes
            </button>
          </>
        )}

        {type === "delete" && (
          <>
            <p>Are you sure you want to delete this budget? This action cannot be reversed, and all the data inside it will be removed forever.</p>
            <button className="ModalDeleteButton" onClick={handleDelete}>Yes, Confirm Deletion</button>
            <button className="ModalCancelButton" onClick={onClose}>No, Go Back</button>
          </>
        )}
      </div>
    </div>
  );
};

export default BudgetModal;
