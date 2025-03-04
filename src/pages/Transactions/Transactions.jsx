import React, { useEffect, useState, useCallback } from "react";
import baseAxios from "../../baseAxios";
import SearchField from "../../components/common/searchField/SearchField.jsx";
import Dropdown from "../../components/common/dropdown/dropdown.jsx";
import "../../styles/fonts.css";
import "./Transactions.css";
import filteringIcon from "../../assets/images/filteringIcon.svg";
import sortingIcon from "../../assets/images/sortingIcon.svg";
import Pagination from "../../components/common/pagination/pagination.jsx";

const SORT_OPTIONS = [
  { value: "Latest", label: "Latest" },
  { value: "Oldest", label: "Oldest" },
  { value: "A%20to%20Z", label: "A to Z" },
  { value: "Z%20to%20A", label: "Z to A" },
  { value: "Highest", label: "Highest" },
  { value: "Lowest", label: "Lowest" },
];

const CATEGORIES = [
  "All", "Entertainment", "Bills", "Groceries", "Dining Out", "Transportation",
  "Personal Care", "Education", "Lifestyle", "Shopping", "General"
];

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });

const formatAmount = (amount) => {
  if (isNaN(Number(amount))) return "N/A";
  return (
    <span style={{ color: amount >= 0 ? "#277C78" : "#201F24" }} className="textPreset4Bold">
      {`${amount >= 0 ? "+" : "-"}$${Math.abs(Number(amount)).toFixed(2)}`}
    </span>
  );
};

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [sortOption, setSortOption] = useState("Latest");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `/api/transaction?page=${page}&limit=10&sortOption=${sortOption}&category=${encodeURIComponent(categoryFilter)}&search=${encodeURIComponent(searchQuery.trim())}`;
      const { data } = await baseAxios.get(url);
      setTransactions(data.transactions || []);
      setTotalPages(data.totalPages || 1);
    } catch {
      setError("Failed to fetch transactions. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page, sortOption, categoryFilter, searchQuery]);
  
  useEffect(() => {
    const debounceTimer = setTimeout(fetchTransactions, 500);
    return () => clearTimeout(debounceTimer);
  }, [fetchTransactions]);

  useEffect(() => {
    let filtered = transactions;
    if (categoryFilter !== "All") {
      filtered = filtered.filter(t => decodeURIComponent(t.category).toLowerCase() === categoryFilter.toLowerCase());
    }
    if (searchQuery.trim()) {
      filtered = filtered.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    setFilteredTransactions(filtered);
  }, [transactions, categoryFilter, searchQuery]);

  return (
    <div className="Transactions">
      <h2 id="TransactionTitle" className="textPreset4Bold">Transactions</h2>
      <div className="TransactionMainBox">
        {error && <div className="errorMessage textPreset5">{error}</div>}
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p className="textPreset5">Loading...</p>
          </div>
        ) : (
          <>
            <div className="TrancsSearchFilters">
              <SearchField type="icon-right" placeholder="Search Transactions" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              <div className="filters">
                <Dropdown label="Sort By" options={SORT_OPTIONS} value={sortOption} onChange={setSortOption} />
                <Dropdown label="Category" options={CATEGORIES.map(cat => ({ value: cat, label: cat }))} value={categoryFilter} onChange={setCategoryFilter} />
              </div>
            </div>
            <div className="transactionList">
              {filteredTransactions.length ? (
                filteredTransactions.map(transaction => (
                  <div key={transaction._id} className="transactionContainer">
                    <div className="personInfo">
                      <img src={transaction.avatar} alt={`${transaction.name} avatar`} className="personImg" />
                    </div>
                    <div className="transactionRow">
                      <div className="rowItem personName textPreset4Bold">{transaction.name}</div>
                      <div className="rowItem CategoryDateInfo textPreset5">{transaction.category}</div>
                      <div className="rowItem CategoryDateInfo textPreset5" id="DateInfo">{formatDate(transaction.date)}</div>
                      <div className="rowItem amountInfo textPreset4Bold">{formatAmount(transaction.amount)}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="noTransactions textPreset5">No transactions available.</div>
              )}
            </div>
          </>
        )}
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}

export default Transactions;
