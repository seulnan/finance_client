import React from 'react';
import { NavLink } from 'react-router-dom';
import '../layouts/SideBar.css';
import Logo from 'C:/university_life/finance_client/src/assets/images/Logo.png';

// 아이콘 가져오기
import OverviewIcon from 'C:/university_life/finance_client/src/assets/images/Icons overview.png';
import OverviewIconActive from 'C:/university_life/finance_client/src/assets/images/Icons overview active.png';
import TransactionIcon from 'C:/university_life/finance_client/src/assets/images/Icons transactions.png';
import TransactionIconActive from 'C:/university_life/finance_client/src/assets/images/Icons transactions active.png';
import BudgetIcon from 'C:/university_life/finance_client/src/assets/images/Icons budgets.png';
import BudgetIconActive from 'C:/university_life/finance_client/src/assets/images/Icons budgets active.png';
import PotsIcon from 'C:/university_life/finance_client/src/assets/images/Icons pots.png';
import PotsIconActive from 'C:/university_life/finance_client/src/assets/images/Icons pots active.png';
import RecurringBillsIcon from 'C:/university_life/finance_client/src/assets/images/Icons recurring bills.png';
import RecurringBillsIconActive from 'C:/university_life/finance_client/src/assets/images/Icons recurring bills active.png';

// 아이콘 컴포넌트
const MenuItem = ({ to, label, icon, iconActive }) => {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => (isActive ? "menu-item active" : "menu-item")}
    >
      {/* 현재 isActive 상태에 따라 아이콘 동적으로 교체 */}
      {({ isActive }) => (
        <>
          <img src={isActive ? iconActive : icon} alt={label} className="icon" />
          {label}
        </>
      )}
    </NavLink>
  );
};

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="logo">
        <img src={Logo} alt="Logo" />
      </div>
      <nav className="menu">
        <ul>
          <li>
            <MenuItem 
              to="/" 
              label="Overview" 
              icon={OverviewIcon} 
              iconActive={OverviewIconActive} 
            />
          </li>
          <li>
            <MenuItem 
              to="/transactions" 
              label="Transactions" 
              icon={TransactionIcon} 
              iconActive={TransactionIconActive} 
            />
          </li>
          <li>
            <MenuItem 
              to="/budgets" 
              label="Budgets" 
              icon={BudgetIcon} 
              iconActive={BudgetIconActive} 
            />
          </li>
          <li>
            <MenuItem 
              to="/pots" 
              label="Pots" 
              icon={PotsIcon} 
              iconActive={PotsIconActive} 
            />
          </li>
          <li>
            <MenuItem 
              to="/recurring-bills" 
              label="Recurring Bills" 
              icon={RecurringBillsIcon} 
              iconActive={RecurringBillsIconActive} 
            />
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
