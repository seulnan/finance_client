import React, { useState, useEffect } from "react";
import baseAxios from "../../../baseAxios.js";
import SearchField from "../searchField/SearchField.jsx";
import "../budgetModal/BudgetModal.css";

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

  useEffect(() => {
    if (type === "add") {
      fetchOptions();
    } else if (type === "edit" && budget) {
      setFormData({
        category: budget.name,
        theme: budget.color,
        limit: budget.limit,
      });
      fetchOptions(); // Ensure options are fetched for editing as well
    }
  }, [type, budget]);

  const fetchOptions = async () => {
    try {
      const response = await baseAxios.get("/api/budget/available-options");
      setOptions(response.data);
      console.log("Options fetched successfully:", response.data);
    } catch (error) {
      console.error("Failed to fetch options:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      console.log("Submitting data:", {
        name: formData.category,
        color: formData.theme,
        limit: parseFloat(formData.limit),
      });

      if (type === "add") {
        const response = await baseAxios.post("/api/budget", {
          name: formData.category,
          color: formData.theme,
          limit: parseFloat(formData.limit),
        });
        console.log("Budget added successfully:", response.data);
      } else if (type === "edit") {
        const response = await baseAxios.patch(`/api/budget/${budget._id}`, {
          color: formData.theme,
          limit: parseFloat(formData.limit),
        });
        console.log("Budget updated successfully:", response.data);
      }
      onSuccess();
    } catch (error) {
      console.error("Failed to save budget:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await baseAxios.delete(`/api/budget/${budget._id}`);
      console.log("Budget deleted successfully:", response.data);
      onSuccess();
    } catch (error) {
      console.error("Failed to delete budget:", error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          ✖
        </button>
        {type === "add" && (
          <>
            <h2>Add New Budget</h2>
            <p>Choose a category to set a spending budget. These categories can help you monitor spending.</p>
            <div className="form-group">
              <label>Budget Category</label>
              <select name="category" onChange={handleInputChange} value={formData.category}>
                <option value="">Select Category</option>
                {options.availableCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
                {options.usedCategories.map((category) => (
                  <option key={category} value={category} disabled>
                    {category} (Already Used)
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Maximum Spend</label>
              <SearchField
                type="icon-left"
                placeholder="e.g. 2000"
                onChange={(e) =>
                  setFormData({ ...formData, limit: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Theme</label>
              <select name="theme" onChange={handleInputChange} value={formData.theme}>
                <option value="">Select Theme</option>
                {options.usedColors.map((color) => (
                  <option key={`used-${color}`} value={color} disabled>
                    {color} (Already Used)
                  </option>
                ))}
                {options.availableColors.map((color) => (
                  <option key={`available-${color}`} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>
            <button className="modal-submit-button" onClick={handleSubmit}>
              Add Budget
            </button>
          </>
        )}
        {type === "edit" && (
          <>
            <h2>Edit Budget</h2>
            <p>As your budgets change, feel free to update your spending limits.</p>
            <div className="form-group">
              <label>Budget Category</label>
              <input type="text" value={formData.category} disabled />
            </div>
            <div className="form-group">
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
            <div className="form-group">
              <label>Theme</label>
              <select name="theme" onChange={handleInputChange} value={formData.theme}>
                <option value="">Select Theme</option>
                {options.usedColors.map((color) => (
                  <option key={`used-${color}`} value={color} disabled>
                    {color} (Already Used)
                  </option>
                ))}
                {options.availableColors.map((color) => (
                  <option key={`available-${color}`} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>
            <button className="modal-submit-button" onClick={handleSubmit}>
              Save Changes
            </button>
          </>
        )}
        {type === "delete" && (
          <>
            <h2>Delete ‘{budget.name}’?</h2>
            <p>
              Are you sure you want to delete this budget? This action cannot be reversed,
              and all the data inside it will be removed forever.
            </p>
            <button className="modal-delete-button" onClick={handleDelete}>
              Yes, Confirm Deletion
            </button>
            <button className="modal-cancel-button" onClick={onClose}>
              No, Go Back
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default BudgetModal;
