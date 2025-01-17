import React, { useState, useEffect } from "react";
import baseAxios from "../../baseAxios.js";
import BudgetModal from "../../components/common/budgetModal/BudgetModal.jsx";
import MeatballMenu from "../../components/common/meatballMenu/MeatballMenu.jsx";
import "../budgets/Budgets.css";

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [modalType, setModalType] = useState("");

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const response = await baseAxios.get("/api/budget");
      setBudgets(response.data);
      console.log("Fetched budgets:", response.data);
    } catch (error) {
      console.error("Failed to fetch budgets:", error);
    }
  };

  const handleModalOpen = (type, budget = null) => {
    setModalType(type);
    setSelectedBudget(budget);
  };

  const handleModalClose = () => {
    setModalType("");
    setSelectedBudget(null);
    fetchBudgets();
  };

  const getColorClass = (color) => {
    const colorMap = {
      Green: "budget-green",
      Yellow: "budget-yellow",
      Cyan: "budget-cyan",
      Navy: "budget-navy",
      Red: "budget-red",
      Purple: "budget-purple",
      Turquoise: "budget-turquoise",
      Brown: "budget-brown",
      Magenta: "budget-magenta",
      Blue: "budget-blue",
      Grey: "budget-grey",
      Army: "budget-army",
      Pink: "budget-pink",
      Gold: "budget-gold",
      Orange: "budget-orange",
    };
    return colorMap[color] || "budget-default";
  };

  return (
    <div className="budget-container">
      <div className="left-summary">
        <div className="summary-box">
          <h3>Spending Summary</h3>
          <ul>
            {budgets.map((budget) => (
              <li key={budget._id} className="summary-item">
                <span className={`summary-color ${getColorClass(budget.color)}`}></span>
                {budget.name}: ${budget.used} / ${budget.limit}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="right-budgets">
        <div className="header">
          <h2>Budgets</h2>
          <button className="add-budget-button" onClick={() => handleModalOpen("add")}>
            + Add New Budget
          </button>
        </div>
        <div className="budget-list">
          {budgets.map((budget) => (
            <div key={budget._id} className={`budget-card ${getColorClass(budget.color)}`}>
              <div className="budget-header">
                <h3>{budget.name}</h3>
                <MeatballMenu
                  onEdit={() => handleModalOpen("edit", budget)}
                  onDelete={() => handleModalOpen("delete", budget)}
                />
              </div>
              <div className="budget-details">
                <p>Maximum: ${budget.limit}</p>
                <p>Spent: ${budget.used}</p>
              </div>
              <h4>Latest Spending</h4>
              <ul>
                {budget.latestSpending.map((item, index) => (
                  <li key={index} className="spending-item">
                    <img src={item.avatar} alt={item.name} />
                    <div>
                      <p>{item.name}</p>
                      <p>{new Date(item.date).toLocaleDateString()}</p>
                      <p>${item.amount}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {modalType && (
          <BudgetModal
            type={modalType}
            budget={selectedBudget}
            onClose={handleModalClose}
            onSuccess={handleModalClose}
          />
        )}
      </div>
    </div>
  );
};

export default Budgets;
