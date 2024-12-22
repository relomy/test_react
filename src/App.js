import React, { useState } from "react";
import Papa from "papaparse";
import {
  Typography,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";

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
        setFilteredData(parsedData); // No default filter, show all data
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
    { field: "Contest_Date_EST", headerName: "Contest Date (EST)", flex: 1 },
    ...Object.keys(data[0] || {})
      .filter((key) => key !== "Contest_Date_EST")
      .map((key) => ({ field: key, headerName: key, flex: 1 })),
  ];

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        DraftKings Contest Analyzer
      </Typography>

      <Button variant="contained" component="label" sx={{ marginBottom: 2 }}>
        Upload CSV
        <input type="file" accept=".csv" hidden onChange={handleFileUpload} />
      </Button>

      {data.length > 0 && (
        <>
          <Typography variant="h5" gutterBottom>
            Total Winnings by Sport
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="sport" />
              <YAxis tickFormatter={currencyFormatter} />
              <Tooltip formatter={(value) => currencyFormatter(value)} />
              <Legend />
              <Bar dataKey="totalWinnings" fill="#2196f3" name="Total Winnings" />
              <Bar dataKey="amountSpent" fill="#f44336" name="Amount Spent" />
              <Bar dataKey="amountWon" fill="#4caf50" name="Amount Won" />
            </BarChart>
          </ResponsiveContainer>

          <Typography variant="h5" gutterBottom sx={{ marginTop: 4 }}>
            Uploaded Data Table
          </Typography>

          <Grid container spacing={2} sx={{ marginBottom: 2 }}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Filter by Sport</InputLabel>
                <Select value={selectedSport} onChange={(e) => setSelectedSport(e.target.value)}>
                  <MenuItem value="">All Sports</MenuItem>
                  {[...new Set(data.map((row) => row["Sport"]))].map((sport) => (
                    <MenuItem key={sport} value={sport}>
                      {sport}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Filter by Date</InputLabel>
                <Select
                  value={selectedDateRange}
                  onChange={(e) => setSelectedDateRange(e.target.value)}
                >
                  <MenuItem value="All Time">All Time</MenuItem>
                  <MenuItem value="Last 30 Days">Last 30 Days</MenuItem>
                  <MenuItem value="Last 90 Days">Last 90 Days</MenuItem>
                  <MenuItem value="Last 180 Days">Last 180 Days</MenuItem>
                  <MenuItem value="Last 365 Days">Last 365 Days</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Search Text"
                variant="outlined"
                fullWidth
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item>
              <Button variant="contained" onClick={handleFilter}>
                Apply Filters
              </Button>
            </Grid>
            <Grid item>
              <Button variant="outlined" onClick={handleResetFilters}>
                Reset Filters
              </Button>
            </Grid>
          </Grid>

          <Box sx={{ height: 400, width: "100%", marginTop: 2 }}>
            <DataGrid
              rows={filteredData.map((row, index) => ({ id: index, ...row }))}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              disableSelectionOnClick
              components={{
                NoRowsOverlay: () => <Typography>No data matching the filter</Typography>,
              }}
            />
          </Box>
        </>
      )}
    </Box>
  );
}

export default App;