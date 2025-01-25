import React, { useEffect, useState } from "react";
import baseAxios from "../../baseAxios";
import Dropdown from "../../components/common/dropdown/dropdown.jsx";
import "../../styles/fonts.css";
import "./Transactions.css";
import Pagination from "../../components/common/pagination/pagination.jsx";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [sortOption, setSortOption] = useState("latest");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sortOptions = [
    { value: "latest", label: "Latest" },
    { value: "oldest", label: "Oldest" },
    { value: "aToZ", label: "A to Z" },
    { value: "zToA", label: "Z to A" },
    { value: "highest", label: "Highest" },
    { value: "lowest", label: "Lowest" },
  ];

  // 날짜 포맷 함수
  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // 금액 포맷 함수
  const formatAmount = (amount) => {
    if (isNaN(Number(amount))) return "N/A";

    const color = amount >= 0 ? "#277C78" : "#201F24";
    const sign = amount >= 0 ? "+" : "-";

    return (
      <span style={{ color }} className="textPreset4Bold">
        {`${sign}$${Math.abs(Number(amount)).toFixed(2)}`}
      </span>
    );
  };

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await baseAxios.get(`/api/transaction?page=${page}&limit=${limit}`);
      const data = response.data;
      setTransactions(data.transactions || []);
      setTotalPages(data.totalPages || 1);
      setCategories([...new Set(data.transactions.map((t) => t.category))]);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError("Failed to fetch transactions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const sortTransactions = (transactions) => {
    switch (sortOption) {
      case "latest":
        return [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
      case "oldest":
        return [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
      case "aToZ":
        return [...transactions].sort((a, b) => a.name.localeCompare(b.name));
      case "zToA":
        return [...transactions].sort((a, b) => b.name.localeCompare(a.name));
      case "highest":
        return [...transactions].sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));
      case "lowest":
        return [...transactions].sort((a, b) => Math.abs(a.amount) - Math.abs(b.amount));
      default:
        return transactions;
    }
  };

  const filterTransactions = () => {
    let filtered = transactions;
    if (categoryFilter !== "all") {
      filtered = transactions.filter((t) => t.category === categoryFilter);
    }
    return sortTransactions(filtered);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page]);

  useEffect(() => {
    setFilteredTransactions(filterTransactions());
  }, [transactions, sortOption, categoryFilter]);

  return (
    <div className="Transactions">
      <h2 id="TransactionTitle" className="textPreset4Bold">Transactions</h2>

      <div className="mainBox">
        {error && <div className="errorMessage textPreset5">{error}</div>}

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p className="textPreset5">Loading...</p>
          </div>
        ) : (
          <div>
            <div className="filters">
              <Dropdown
                label="Sort By"
                options={sortOptions}
                value={sortOption}
                onChange={setSortOption}
              />
              <Dropdown
                label="Filter By Category"
                options={[{ value: "all", label: "All Transactions" }, ...categories.map((cat) => ({ value: cat, label: cat }))]}
                value={categoryFilter}
                onChange={setCategoryFilter}
              />
            </div>

            <div className="transactionHeader">
              <div className="headerItem textPreset5">Recipient / Sender</div>
              <div className="headerItem textPreset5" id="CategoryTitle">Category</div>
              <div className="headerItem textPreset5" id="DateTitle">Transaction Date</div>
              <div className="headerItem textPreset5" id="amountTitle">Amount</div>
            </div>

            <div className="transactionList">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <div key={transaction._id} className="transactionContainer">
                    <div className="personInfo">
                      <img
                        src={transaction.avatar}
                        alt={`${transaction.name} avatar`}
                        className="personImg"
                      />
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
          </div>
        )}

        <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </div>
  );
}

export default Transactions;
