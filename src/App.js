import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import Papa from "papaparse";
import Chart from "./components/Chart";
import Filters from "./components/Filters";
import DataTable from "./components/DataTable";
import UploadButton from "./components/UploadButton";

function App() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [selectedSport, setSelectedSport] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState("All Time");
  const [searchText, setSearchText] = useState("");

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedData = results.data.map((row) => ({
          ...row,
          Winnings_Non_Ticket: parseFloat(row["Winnings_Non_Ticket"].replace("$", "")) || 0,
          Winnings_Ticket: parseFloat(row["Winnings_Ticket"].replace("$", "")) || 0,
          Entry_Fee: parseFloat(row["Entry_Fee"].replace("$", "")) || 0,
          Contest_Date_EST: dayjs(row["Contest_Date_EST"]),
        }));
        setData(parsedData);
        setFilteredData(parsedData);
        updateChartData(parsedData);
      },
    });
  };

  const updateChartData = (data) => {
    const winningsBySport = data.reduce((acc, row) => {
      const sport = row["Sport"];
      const amountWon = row.Winnings_Non_Ticket + row.Winnings_Ticket;
      const amountSpent = row.Entry_Fee;
      const totalWinnings = amountWon - amountSpent;

      if (!acc[sport]) {
        acc[sport] = { sport, totalWinnings: 0, amountSpent: 0, amountWon: 0 };
      }

      acc[sport].totalWinnings += totalWinnings;
      acc[sport].amountSpent += amountSpent;
      acc[sport].amountWon += amountWon;

      return acc;
    }, {});

    const chartDataArray = Object.values(winningsBySport).map((item) => ({
      ...item,
      totalWinnings: parseFloat(item.totalWinnings.toFixed(2)),
      amountSpent: parseFloat(item.amountSpent.toFixed(2)),
      amountWon: parseFloat(item.amountWon.toFixed(2)),
    }));

    // Ensure this line exists to use setChartData
    setChartData(chartDataArray);
  };

  const handleFilter = () => {
    let filtered = [...data];

    // Apply sport filter
    if (selectedSport) {
      filtered = filtered.filter((row) => row["Sport"] === selectedSport);
    }

    // Apply date filter
    if (selectedDateRange !== "All Time") {
      const days = {
        "Last 30 Days": 30,
        "Last 90 Days": 90,
        "Last 180 Days": 180,
        "Last 365 Days": 365,
      }[selectedDateRange];
      const cutoffDate = dayjs().subtract(days, "day");
      filtered = filtered.filter((row) => row.Contest_Date_EST.isAfter(cutoffDate));
    }

    // Apply text search filter
    if (searchText) {
      const search = searchText.toLowerCase();
      filtered = filtered.filter((row) =>
        Object.values(row).some((value) =>
          value?.toString().toLowerCase().includes(search)
        )
      );
    }

    setFilteredData(filtered);
  };

  const handleResetFilters = () => {
    setSelectedSport("");
    setSelectedDateRange("All Time");
    setSearchText("");
    setFilteredData(data);
  };

  const currencyFormatter = (value) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const columns = [
    {
      field: "Contest_Date_EST",
      headerName: "Contest Date (EST)",
      flex: 1,
      valueFormatter: (params) => dayjs(params).format("YYYY-MM-DD HH:mm"),
    },
    ...Object.keys(data[0] || {})
      .filter((key) => !["Game_Type", "Entry_Key", "Contest_Key", "Contest_Date_EST"].includes(key))
      .map((key) => ({ field: key, headerName: key, flex: 1 })),
  ];

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        DraftKings Contest Analyzer
      </Typography>
      <UploadButton onFileUpload={handleFileUpload} />
      {data.length > 0 && (
        <>
          <Chart chartData={chartData} currencyFormatter={currencyFormatter} />
          <Filters
            data={data}
            selectedSport={selectedSport}
            setSelectedSport={setSelectedSport}
            selectedDateRange={selectedDateRange}
            setSelectedDateRange={setSelectedDateRange}
            searchText={searchText}
            setSearchText={setSearchText}
            handleFilter={handleFilter}
            handleResetFilters={handleResetFilters}
          />
          <DataTable rows={filteredData.map((row, index) => ({ id: index, ...row }))} columns={columns} />
        </>
      )}
    </Box>
  );
}

export default App;