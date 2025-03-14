import React, { useEffect, useState } from "react";
import baseAxios from "../../baseAxios";
import SearchField from "../../components/common/searchField/SearchField.jsx"; 
import Dropdown from "../../components/common/dropdown/dropdown.jsx";
import "../../styles/fonts.css";
import "./Transactions.css";
import filteringIcon from "../../assets/images/filteringIcon.svg";
import sortingIcon from "../../assets/images/sortingIcon.svg";
import Pagination from "../../components/common/pagination/pagination.jsx";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [sortOption, setSortOption] = useState("Latest"); // 기본값 최신순
  const [categoryFilter, setCategoryFilter] = useState("All"); // 기본값 All
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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
    "Dining Out",
    "Transportation",
    "Personal Care",
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
      let url = `/api/transaction?page=${page}&limit=${limit}`;
  
      if (sortOption !== "Latest") {
        url += `&sortOption=${sortOption}`;
      }
      if (categoryFilter !== "All") {
        url += `&category=${encodeURIComponent(categoryFilter)}`;
      }
      if (searchQuery.trim() !== "") {
        url += `&search=${encodeURIComponent(searchQuery.trim())}`;
      }
  
      const response = await baseAxios.get(url);
      const data = response.data;
  
      setTransactions(data.transactions || []);
      setTotalPages(data.totalPages || 1);

    } catch (error) {
      setError("Failed to fetch transactions. Please try again.");
    } finally {
      setLoading(false);
    }
  };    

  useEffect(() => {
    let filtered = [...transactions];

    if (categoryFilter !== "All") {
      filtered = filtered.filter((t) =>
        decodeURIComponent(t.category).toLowerCase().trim() === categoryFilter.toLowerCase().trim()
      );
    }

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((t) =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTransactions(filtered);
  }, [transactions, categoryFilter, searchQuery]);

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
    setFilteredTransactions(sortedData);
  }, [transactions, sortOption, categoryFilter, page]);


  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchTransactions();
    }, 500); // 500ms 디바운싱 적용
  
    return () => clearTimeout(debounceTimer);
  }, [page, sortOption, categoryFilter, searchQuery]);  

  useEffect(() => {
  }, [transactions]);
  
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
          <div>
            <div className="TrancsSearchFilters">
              <SearchField 
                type="icon-right" 
                placeholder="Search Transactions" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
              />
              <div className="filters">
                {/* 기본 화면에서는 기존 드롭다운 표시 */}
                <div className="DesktopFilters">
                  <Dropdown label="Sort By" options={sortOptions} value={sortOption} onChange={setSortOption} />
                  <Dropdown label="Category" options={categories.map((cat) => ({ value: cat, label: cat }))} value={categoryFilter} onChange={setCategoryFilter} />
                </div>

                {/* 모바일 화면에서는 아이콘만 표시 */}
                <div className="MobileFilters">
                  <div className="TransDropdownContainer">
                    <img 
                      src={sortingIcon} 
                      alt="Sort"
                      className="filteringIcon"
                      onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                    />
                    {isSortDropdownOpen && (
                      <div className="TransDropdownMenu">
                        {sortOptions.map((option) => (
                          <div 
                            key={option.value} 
                            className={`TransDropdownItem ${sortOption === option.value ? "selected" : ""}`}
                            onClick={() => {
                              setSortOption(option.value);
                              setIsSortDropdownOpen(false);
                            }}
                          >
                            {option.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="TransDropdownContainer">
                    <img 
                      src={filteringIcon} 
                      alt="Filter"
                      className="filteringIcon"
                      onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                    />
                    {isFilterDropdownOpen && (
                      <div className="TransDropdownMenu">
                        {categories.map((category) => (
                          <div 
                            key={category} 
                            className={`TransDropdownItem ${categoryFilter === category ? "selected" : ""}`}
                            onClick={() => {
                              setCategoryFilter(category);
                              setIsFilterDropdownOpen(false);
                            }}
                          >
                            {category}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="transactionHeader">
              <div className="headerItem textPreset5" id="NameTitle">Recipient / Sender</div>
              <div className="headerItem textPreset5" id="CategoryTitle">Category</div>
              <div className="headerItem textPreset5" id="DateTitle">Transaction Date</div>
              <div className="headerItem textPreset5" id="AmountTitle">Amount</div>
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

        {/* 페이지네이션 */}
        <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </div>
  );
}

export default Transactions;
