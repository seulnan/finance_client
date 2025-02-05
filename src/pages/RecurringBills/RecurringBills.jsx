import React, { useEffect, useState } from "react";
import baseAxios from "../../baseAxios";
import SearchField from "../../components/common/searchField/SearchField.jsx";
import Dropdown from "../../components/common/dropdown/dropdown.jsx";
import "../../styles/fonts.css";
import "./RecurringBills.css";
import totalBillsIcon from "../../assets/images/totalBillsIcon.svg";

function RecurringBills() {
  const [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [sortOption, setSortOption] = useState("Latest");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sortOptions = [
    { value: "Latest", label: "Latest" },
    { value: "Oldest", label: "Oldest" },
    { value: "A to Z", label: "A to Z" },
    { value: "Z to A", label: "Z to A" },
    { value: "Highest", label: "Highest" },
    { value: "Lowest", label: "Lowest" },
  ];

  useEffect(() => {
    const fetchBills = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await baseAxios.get("/api/recurring");
        setBills(response.data || []);
      } catch (error) {
        setError("Failed to fetch recurring bills. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchBills();
  }, []);

  useEffect(() => {
    let sortedData = [...bills];

    if (searchQuery.trim()) {
      sortedData = sortedData.filter((bill) =>
        bill.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (sortOption) {
      case "Oldest":
        sortedData.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case "Latest":
        sortedData.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "Highest":
        sortedData.sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));
        break;
      case "Lowest":
        sortedData.sort((a, b) => Math.abs(a.amount) - Math.abs(b.amount));
        break;
      case "A to Z":
        sortedData.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "Z to A":
        sortedData.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    setFilteredBills(sortedData);
  }, [bills, searchQuery, sortOption]);

  const totalAmount = bills.reduce((sum, bill) => sum + Math.abs(parseFloat(bill.amount)), 0).toFixed(2);

  return (
    <div className="RecurringBills">
      <h2 className="title textPreset4Bold">Recurring Bills</h2>
      <div className="BillsBoxes">
        <div className="summaryBox">
          <div className="totalBills">
            <img src={totalBillsIcon} alt="Total Bills" />
            <p id="totalTitle" className="textPreset4">Total Bills</p>
            <h1 id="totalBills" className="textPreset1">${totalAmount}</h1>
          </div>
          <div className="summaryDetails">
            <p id="SummaryTitle" className="textPreset3">Summary</p>
            <div className="SummaryContent">
              <p className="textPreset5">Paid Bills <span className="textPreset5Bold">0 ($0.00)</span></p>
              <hr className="divider" />
              <p className="textPreset5">Total Upcoming <span className="textPreset5Bold">0 ($0.00)</span></p>
              <hr className="divider" />
              <p className="textPreset5 dueSoon">Due Soon <span className="textPreset5Bold">0 ($0.00)</span></p>
            </div>
          </div>
        </div>
        <div className="recurringBillsMain">
          <div className="BillsSearchFilters">
            <SearchField placeholder="Search bills" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <Dropdown label="Sort By" options={sortOptions} value={sortOption} onChange={setSortOption} />
          </div>
          <div className="billsHeader">
            <span className="textPreset5" id="BillTitle">Bill Title</span>
            <span className="textPreset5" id="BillDueTitle">Due Date</span>
            <span className="textPreset5" id="BillAmountTitle">Amount</span>
          </div>
          <div className="billsList">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>{error}</p>
            ) : filteredBills.length > 0 ? (
              filteredBills.map((bill) => (
                <div key={bill._id} className="billContainer">
                  <div className="billInfo">
                    <img src={bill.avatar} alt={bill.name} className="billImg" />
                    <span className="textPreset4Bold">{bill.name}</span>
                  </div>
                  <span className="billDate textPreset5">{new Date(bill.date).toLocaleDateString()}</span>
                  <span className="billAmount textPreset4Bold">${Math.abs(parseFloat(bill.amount)).toFixed(2)}</span>
                </div>
              ))
            ) : (
              <p>No recurring bills available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecurringBills;
