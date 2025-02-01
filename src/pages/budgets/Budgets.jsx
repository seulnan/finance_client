import React, { useState, useEffect } from "react";
import BaseAxios from "../../baseAxios.js";
import BudgetModal from "../../components/common/budgetModal/BudgetModal.jsx";
import MeatballMenu from "../../components/common/meatballMenu/MeatballMenu.jsx";
import "../budgets/Budgets.css";

const Budgets = () => {
  const [BudgetsData, SetBudgetsData] = useState([]);
  const [SelectedBudget, SetSelectedBudget] = useState(null);
  const [ModalType, SetModalType] = useState("");

  useEffect(() => {
    FetchBudgets();
  }, []);

  const FetchBudgets = async () => {
    try {
      const Response = await BaseAxios.get("/api/budget");
      SetBudgetsData(Response.data);
    } catch (Error) {
      console.error("Failed to fetch budgets:", Error);
    }
  };

  const HandleModalOpen = (Type, Budget = null) => {
    SetModalType(Type);
    SetSelectedBudget(Budget);
  };

  const HandleModalClose = () => {
    SetModalType("");
    SetSelectedBudget(null);
    FetchBudgets();
  };

  const HandleDeleteBudget = async () => {
    if (!SelectedBudget?._id) {
      console.error("Invalid Budget ID for deletion");
      return;
    }
    try {
      console.log("Deleting Budget ID:", SelectedBudget._id);
      await BaseAxios.delete(`/api/budget/${SelectedBudget._id}`);

      // 삭제 후 UI 업데이트
      SetBudgetsData((prevBudgets) => prevBudgets.filter(b => b._id !== SelectedBudget._id));

      HandleModalClose(); // 삭제 후 모달 닫기
    } catch (Error) {
      console.error("Failed to delete budget:", Error);
    }
  };

  const GetColorClass = (Color) => {
    const ColorMap = {
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
    return ColorMap[Color] || "budget-default";
  };

  return (
    <div className="BudgetContainer">
      <div className="BudgetHeaderOne">
        <h1>Budgets</h1>
        <button className="AddBudgetButton" onClick={() => HandleModalOpen("add")}>
          + Add New Budget
        </button>
      </div>

      <div className="BudgetContent">
        <div className="LeftSummary">
          <div className="SummaryBox">
            <h3>Spending Summary</h3>
            <div>
              {BudgetsData.map((Budget) => {
                const UsedAmount = Number(Budget.used) || 0;
                const LimitAmount = Number(Budget.limit) || 1;

                return (
                  <div className="SummaryItem">
                    <div className="SummaryColorBar" style={{ backgroundColor: Budget.color }}></div>
                    <div className="SummaryDetails">
                      <p className="BudgetName">{Budget.name}</p>
                    </div>
                    <div className="SummaryAmount">
                      <p>
                        <span className="SummaryAmount">${UsedAmount.toFixed(2)}</span> of ${LimitAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>

                );
              })}
            </div>
          </div>
        </div>

        <div className="RightBudgets">
          <div className="BudgetList">
            {BudgetsData.map((Budget) => {
              const UsedAmount = Number(Budget.used) || 0;
              const LimitAmount = Number(Budget.limit) || 1;
              const RemainingAmount = LimitAmount - UsedAmount;
              const ProgressWidth = Math.max(1, Math.min((UsedAmount / LimitAmount) * 100, 100));

              return (
                <div key={Budget._id} className="BudgetCard">
                  <div className="BudgetHeader">
                  <div className="BudgetTitle">
                    <span className="BudgetCircle" style={{ backgroundColor: Budget.color }}></span>
                    <h3>{Budget.name}</h3>
                  </div>
                    <MeatballMenu
                      onEdit={() => HandleModalOpen("edit", Budget)}
                      onDelete={() => HandleModalOpen("delete", Budget)} // ✅ 삭제 모달을 먼저 띄움
                    />
                  </div>

                  <p className="BudgetMax">Maximum: ${LimitAmount.toFixed(2)}</p>

                  <div className="ProgressBar">
                  <div className="ProgressFill" style={{ width: `${ProgressWidth}%`, backgroundColor: Budget.color }}></div>
                  </div>

                  <div className="BudgetStats">
                    <div className="Spent">
                      <span>Spent</span>
                      <span className = "SpentBold">${UsedAmount.toFixed(2)}</span>
                    </div>
                    <div className="VerticalDivider"></div>
                    <div className="Remaining">
                      <span>Remaining</span>
                      <span className = "SpentBold">${RemainingAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="TransactionHistory">
                    <h4 className="TransactionHistoryTitle">Latest Spending</h4>
                    {Budget.latestSpending.map((Item, Index) => (
                      <div key={Index} className="SpendingItem">
                        <img src={Item.avatar} alt={Item.name} className="Avatar" />
                        <div className="SpendingDetails">
                          <p className="SpendingName">{Item.name}</p>
                        </div>
                        <div className="SpendingInfo">
                          <p className="SpendingAmount">-${Number(Item.amount).toFixed(2)}</p>
                          <p className="SpendingDate">{new Date(Item.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {ModalType === "delete" && SelectedBudget && (
        <BudgetModal
          type="delete"
          budget={SelectedBudget}
          onClose={HandleModalClose}
          onDelete={HandleDeleteBudget} // ✅ 삭제 후 실행
          onSuccess={HandleModalClose}
        />
      )}

      {ModalType === "edit" && SelectedBudget && (
        <BudgetModal
          type="edit"
          budget={SelectedBudget}
          onClose={HandleModalClose}
          onSuccess={HandleModalClose}
        />
      )}

      {ModalType === "add" && (
        <BudgetModal
          type="add"
          onClose={HandleModalClose}
          onSuccess={HandleModalClose}
        />
      )}
    </div>
  );
};

export default Budgets;
