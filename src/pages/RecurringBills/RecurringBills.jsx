import React, { useEffect, useState } from "react";
import baseAxios from "../../baseAxios";
import SearchField from "../../components/common/searchField/SearchField.jsx";
import Dropdown from "../../components/common/dropdown/dropdown.jsx";
import "../../styles/fonts.css";
import "./RecurringBills.css";
import totalBillsIcon from "../../assets/images/totalBillsIcon.svg";
import PaidIcon from "../../assets/images/PaidIcon.svg";
import DueSoonIcon from "../../assets/images/DueSoonIcon.svg";

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

  const today = new Date();
  const fiveDaysLater = new Date();
  fiveDaysLater.setDate(today.getDate() + 5);

  const paidBills = bills.filter(bill => {
    const billDay = parseInt(bill.date.match(/\d+/)[0]);
    return billDay < today.getDate();
  });
  const totalUpcomingBills = bills.filter(bill => {
    const billDay = parseInt(bill.date.match(/\d+/)[0]);
    return billDay >= today.getDate();
  });
  const dueSoonBills = totalUpcomingBills.filter(bill => {
    const billDay = parseInt(bill.date.match(/\d+/)[0]);
    return billDay <= fiveDaysLater.getDate();
  });

  const calculateSummary = (billsArray) => {
    const count = billsArray.length;
    const totalAmount = billsArray.reduce((sum, bill) => sum + Math.abs(parseFloat(bill.amount)), 0).toFixed(2);
    return { count, totalAmount };
  };

  const paidSummary = calculateSummary(paidBills);
  const upcomingSummary = calculateSummary(totalUpcomingBills);
  const dueSoonSummary = calculateSummary(dueSoonBills);
  const totalAmount = bills.reduce((sum, bill) => sum + Math.abs(parseFloat(bill.amount)), 0).toFixed(2);

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
        sortedData.sort((a, b) => parseInt(b.date.match(/\d+/)[0]) - parseInt(a.date.match(/\d+/)[0]));
        break;
      case "Latest":
        sortedData.sort((a, b) => parseInt(a.date.match(/\d+/)[0]) - parseInt(b.date.match(/\d+/)[0]));
        break;
      case "A to Z":
        sortedData.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "Z to A":
        sortedData.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "Highest":
        sortedData.sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));
        break;
      case "Lowest":
        sortedData.sort((a, b) => Math.abs(a.amount) - Math.abs(b.amount));
        break;
      default:
        break;
    }

    setFilteredBills(sortedData);
  }, [bills, searchQuery, sortOption]);

  return (
    <div className="RecurringBills">
      <h2 className="title textPreset4Bold">Recurring Bills</h2>
      <div className="TotalSummaryBox">
        <div className="summaryBox">
          <div className="totalBills">
            <img src={totalBillsIcon} alt="Total Bills" />
            <p id="totalTitle" className="textPreset4">Total Bills</p>
            <h1 id="totalBills" className="textPreset1">${totalAmount}</h1>
          </div>
          <div className="summaryDetails">
            <p id="SummaryTitle" className="textPreset3">Summary</p>
            <div className="SummaryContent">
              <p className="textPreset5">Paid Bills <span className="textPreset5Bold SummaryAmount">{paidSummary.count} (${paidSummary.totalAmount})</span></p>
              <hr className="divider" />
              <p className="textPreset5">Total Upcoming <span className="textPreset5Bold SummaryAmount">{upcomingSummary.count} (${upcomingSummary.totalAmount})</span></p>
              <hr className="divider" />
              <p className="textPreset5 dueSoon">Due Soon <span className="textPreset5Bold dueSoonAmount">{dueSoonSummary.count} (${dueSoonSummary.totalAmount})</span></p>
            </div>
          </div>
        </div>
        <div className="recurringBillsMain">
          <div className="searchFilters">
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
              filteredBills.map((bill) => {
                const billDay = parseInt(bill.date.match(/\d+/)[0]);
                const isPaid = billDay < today.getDate();
                const isDueSoon = billDay >= today.getDate() && billDay <= fiveDaysLater.getDate();

                return (
                  <div key={bill._id} className="billContainer">
                    <div className="billInfo">
                      <img src={bill.avatar} alt={bill.name} className="billImg" />
                      <span className="textPreset4Bold" id="billsNameData">{bill.name}</span>
                    </div>
                    <div className="billDateWrapper">
                      <span className={`billDate textPreset5 ${isPaid ? "paidDate" : ""}`}>{bill.date}</span>
                      {isPaid && <img src={PaidIcon} alt="Paid" className="statusIcon paidIcon" />}
                      {isDueSoon && <img src={DueSoonIcon} alt="Due Soon" className="statusIcon dueSoonIcon" />}
                    </div>
                    <span className={`billAmount textPreset4Bold ${isDueSoon ? "dueSoonAmount" : ""}`}>
                      ${Math.abs(parseFloat(bill.amount)).toFixed(2)}
                    </span>
                  </div>
                );
              })
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
