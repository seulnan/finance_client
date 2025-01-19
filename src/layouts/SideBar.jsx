import React from 'react';
import { NavLink } from 'react-router-dom';
import '../layouts/SideBar.css';
import Logo from '../assets/images/Logo.png';

// 아이콘 가져오기
import OverviewIcon from '../assets/images/Icons overview.png';
import OverviewIconActive from '../assets/images/Icons overview active.png';
import TransactionIcon from '../assets/images/Icons transactions.png';
import TransactionIconActive from '../assets/images/Icons transactions active.png';
import BudgetIcon from '../assets/images/Icons budgets.png';
import BudgetIconActive from '../assets/images/Icons budgets active.png';
import PotsIcon from '../assets/images/Icons pots.png';
import PotsIconActive from '../assets/images/Icons pots active.png';
import RecurringBillsIcon from '../assets/images/Icons recurring bills.png';
import RecurringBillsIconActive from '../assets/images/Icons recurring bills active.png';

// 아이콘 컴포넌트
const MenuItem = ({ to, label, icon, iconActive }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => (isActive ? "MenuItem Active" : "MenuItem")}
    >
      {({ isActive }) => (
        <>
          <img src={isActive ? iconActive : icon} alt={label} className="Icon" />
          {label}
        </>
      )}
    </NavLink>
  );
};

const SideBar = () => {
  return (
    <div className="SideBar">
      <div className="Logo">
        <img src={Logo} alt="Logo" />
      </div>
      <nav className="Menu">
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

export default SideBar;
