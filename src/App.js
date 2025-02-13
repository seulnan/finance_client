import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './layouts/SideBar.jsx';
import Transactions from './pages/Transactions/Transactions.jsx';
import Budgets from './pages/budgets/Budgets.jsx';
import RecurringBills from './pages/RecurringBills/RecurringBills.jsx';
import Pots from './pages/pots/Pots.jsx'

function App() {
  return (
    <Router>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flexGrow: 1, height: '100vh', backgroundColor: '#F8F4F0' }}>
          <Routes>
            <Route path="/" element={<h1>Overview</h1>} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/budgets" element={<Budgets />} />
            <Route path="/pots" element={<Pots />} />
            <Route path="/recurring-bills" element={<RecurringBills />} />
            <Route path="/new-budget" element={<h1>New Budget</h1>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
