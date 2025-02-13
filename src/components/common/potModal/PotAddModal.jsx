import React, { useState, useEffect } from "react";
import baseAxios from "../../../baseAxios.js";
import SearchField from "../searchField/SearchField.jsx";
import "../potModal/PotAddModal.css"; // ✅ 동일한 CSS 사용
import "../../../styles/colors.css";

import Dropdowncross from '../../../assets/images/dropdowncross.svg';
import DropdowncrossRotate from '../../../assets/images/dropdowncrossrotate.svg';

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

const PotModal = ({ type, pot, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    theme: "",
    target: "",
  });

  const MAX_LENGTH = 30;

  const [options, setOptions] = useState({
    availableColors: [],
    usedColors: [],
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isRotated, setIsRotated] = useState(false);

  useEffect(() => {
    if (type === "add") {
      fetchOptions();
    } else if (type === "edit" && pot) {
      setFormData({
        name: pot.name,
        theme: pot.color,
        target: pot.target,
      });
      fetchOptions();
    }
  }, [type, pot]);

  const fetchOptions = async () => {
    try {
      const response = await baseAxios.get("/api/pot/available-colors");
      setOptions(response.data);
    } catch (error) {
      console.error("Failed to fetch options:", error);
    }
  };

  const handleThemeSelection = (color) => {
    setFormData({ ...formData, theme: color });
    setDropdownOpen(false);
    setIsRotated(false);
  };

  const handleSubmit = async () => {
    try {
      if (type === "add") {
        await baseAxios.post("/api/pot", {
          name: formData.name,
          color: formData.theme,
          target: parseFloat(formData.target),
        });
      } else if (type === "edit") {
        await baseAxios.patch(`/api/pot/${pot._id}`, {
          name: formData.name,
          color: formData.theme,
          target: parseFloat(formData.target),
        });
      }
      onSuccess();
    } catch (error) {
      console.error("Failed to save pot:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await baseAxios.delete(`/api/pot/${pot._id}`);
      onSuccess();
    } catch (error) {
      console.error("Failed to delete pot:", error);
    }
  };

  return (
    <div className="Modal">
      <div className="ModalContent">
        <div className="ModalHeader">
          <h2>
            {type === "add"
              ? "Add New Pot"
              : type === "edit"
              ? "Edit Pot"
              : `Delete ‘${pot.name}’?`}
          </h2>
          <button className="CloseButton" onClick={onClose}></button>
        </div>

        {/* ✅ Add & Edit */}
        {(type === "add" || type === "edit") && (
          <>
            <div className="ExplainBox">
                {type === "add"
                    ? "Create a pot to set savings targets. These can help keep you on track as you save for special purchases."
                    : type === "edit"
                    ? "If your saving targets change, feel free to update your pots."
                    : ""}
            </div>

            {/* Pot Name 입력 */}
            <div className="FormGroup">
              <div className="Title">Pot Name</div>
              <input
                className = 'PotNameInput'
                type="text"
                placeholder="e.g. Rainy Days"
                value={formData.name}
                maxLength={MAX_LENGTH}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <div className="CharCount">{MAX_LENGTH - formData.name.length} characters left</div>
            </div>

            {/* Target (목표 금액) 입력 - SearchField 적용 */}
            <div className="FormGroup">
              <div className="Title">Target</div>
              <SearchField
                type="icon-left"
                placeholder="e.g. 2000"
                value={formData.target}
                onChange={(e) =>
                  setFormData({ ...formData, target: e.target.value })}
              />
            </div>

            {/* Theme (색상 선택) 드롭다운 */}
            <div className="FormGroup">
              <div className="Title">Theme</div>
              <div className="ColorDropdown">
                <div
                  className="DropdownHeader"
                  onClick={() => {
                    setDropdownOpen(!dropdownOpen);
                    setIsRotated(!isRotated);
                  }}
                >
                <div className ='SelectName'
                    style={{ display: "flex", alignItems: "center", width: "100%" }}>
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
                    src={isRotated ? DropdowncrossRotate : Dropdowncross}
                    alt="Toggle Dropdown"
                    className="DropdownCloseIcon"
                  />
                </div>

                {dropdownOpen && (
                  <div className="DropdownList">
                    {options.usedColors.map((color) => (
                      <div
                        key={`used-${color}`}
                        className="DropdownOption Disabled"
                      >
                        <span
                          className="ColorCircle"
                          style={{ backgroundColor: GetColorVariable(color) }}
                        ></span>
                        <span className="ColorName">{color}</span>
                        <span className="AlreadyUsed">Already Used</span>
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
                          style={{ backgroundColor: GetColorVariable(color) }}
                        ></span>
                        {color}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button className="ModalSubmitButton" onClick={handleSubmit}>
              {type === "add" ? "Add Pot" : "Save Changes"}
            </button>
          </>
        )}

        {/* ✅ Delete */}
        {type === "delete" && (
          <>
            <div className="ExplainBox">
                Are you sure you want to delete this pot? This action cannot be reversed, and all the data inside it will be removed forever.
            </div>
            <button className="ModalDeleteButton" onClick={handleDelete}>
              Yes, Confirm Deletion
            </button>
            <button className="ModalCancelButton" onClick={onClose}>
              No, Go Back
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PotModal;
