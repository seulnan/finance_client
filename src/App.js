import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './layouts/SideBar.jsx';
import Transactions from './pages/Transactions.jsx';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flexGrow: 1, padding: '20px', backgroundColor: '#f8f6f4' }}>
          <Routes>
            <Route path="/" element={<h1>Overview</h1>} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/budgets" element={<h1>Budgets</h1>} />
            <Route path="/pots" element={<h1>Pots</h1>} />
            <Route path="/recurring-bills" element={<h1>Recurring Bills</h1>} />
            <Route path="/new-budget" element={<h1>New Budget</h1>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
