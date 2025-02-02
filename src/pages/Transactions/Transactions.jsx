import React, { useEffect, useState } from "react";
import baseAxios from "../../baseAxios";
import Dropdown from "../../components/common/dropdown/dropdown.jsx";
import "../../styles/fonts.css";
import "./Transactions.css";
import Pagination from "../../components/common/pagination/pagination.jsx";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [sortOption, setSortOption] = useState("Latest"); // 기본값 최신순
  const [categoryFilter, setCategoryFilter] = useState("All"); // 기본값 All
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ 드롭다운 옵션 (백엔드 요청 형식과 일치)
  const sortOptions = [
    { value: "Latest", label: "Latest" },
    { value: "Oldest", label: "Oldest" },
    { value: "A%20to%20Z", label: "A to Z" },
    { value: "Z%20to%20A", label: "Z to A" },
    { value: "Highest", label: "Highest" },
    { value: "Lowest", label: "Lowest" },
  ];

  const categories = [
    "All",
    "Entertainment",
    "Bills",
    "Groceries",
    "Dining out",
    "Transportation",
    "Personal care",
    "Education",
    "Lifestyle",
    "Shopping",
    "General",
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

  // ✅ 백엔드에서 데이터 가져오기
  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `/api/transaction?page=1&limit=100`; // 전체 데이터 가져오기
  
      if (sortOption !== "Latest") {
        url += `&sortOption=${sortOption}`;
      }
      if (categoryFilter !== "All") {
        url += `&category=${encodeURIComponent(categoryFilter)}`; // ✅ 띄어쓰기 포함된 값 처리
      }
  
      const response = await baseAxios.get(url);
      const data = response.data;
  
      console.log("Received transactions:", data.transactions); // ✅ 데이터 확인
  
      setTransactions(data.transactions || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError("Failed to fetch transactions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ 데이터 정렬 & 필터링
  useEffect(() => {
    let sortedData = [...transactions];

    // 카테고리 필터링
    if (categoryFilter !== "All") {
      sortedData = sortedData.filter(
        (t) => decodeURIComponent(t.category).toLowerCase().trim() === categoryFilter.toLowerCase().trim()
      );
    }

    // 정렬 적용
    switch (sortOption) {
      case "Oldest":
        sortedData.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case "A%20to%20Z":
        sortedData.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "Z%20to%20A":
        sortedData.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "Highest":
        sortedData.sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));
        break;
      case "Lowest":
        sortedData.sort((a, b) => Math.abs(a.amount) - Math.abs(b.amount));
        break;
      default:
        sortedData.sort((a, b) => new Date(b.date) - new Date(a.date)); // 최신순
        break;
    }

    // 페이지네이션 적용
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    setFilteredTransactions(sortedData.slice(startIndex, endIndex));
    setTotalPages(Math.ceil(sortedData.length / limit));
  }, [transactions, sortOption, categoryFilter, page]);

  useEffect(() => {
    fetchTransactions();
  }, []);

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
            {/* ✅ 필터링 드롭다운 */}
            <div className="filters">
              <Dropdown label="Sort By" options={sortOptions} value={sortOption} onChange={setSortOption} />
              <Dropdown label="Category" options={categories.map((cat) => ({ value: cat, label: cat }))} value={categoryFilter} onChange={setCategoryFilter} />
            </div>

            {/* ✅ 테이블 헤더 */}
            <div className="transactionHeader">
              <div className="headerItem textPreset5">Recipient / Sender</div>
              <div className="headerItem textPreset5" id="CategoryTitle">Category</div>
              <div className="headerItem textPreset5" id="DateTitle">Transaction Date</div>
              <div className="headerItem textPreset5" id="AmountTitle">Amount</div>
            </div>

            {/* ✅ 트랜잭션 리스트 */}
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
                      <div className="rowItem CategoryDateInfo textPreset5">{formatDate(transaction.date)}</div>
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

        {/* ✅ 페이지네이션 */}
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}

export default Transactions;
