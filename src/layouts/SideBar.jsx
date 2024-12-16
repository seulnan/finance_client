import React from 'react';
import { NavLink } from 'react-router-dom';
import '../layouts/SideBar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="logo">finance</div>
      <nav className="menu">
        <ul>
          <li>
            <NavLink to="http://localhost:3000/" end className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
              Overview
            </NavLink>
          </li>
          <li>
            <NavLink to="/transactions" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
              Transactions
            </NavLink>
          </li>
          <li>
            <NavLink to="/budgets" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
              Budgets
            </NavLink>
          </li>
          <li>
            <NavLink to="/pots" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
              Pots
            </NavLink>
          </li>
          <li>
            <NavLink to="/recurring-bills" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
              Recurring Bills
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
