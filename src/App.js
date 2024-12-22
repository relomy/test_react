import React, { useState } from "react";
import Papa from "papaparse";
import {
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from "@mui/material";
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

function App() {
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState([]);

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
        }));
        setData(parsedData);

        const winningsBySport = parsedData.reduce((acc, row) => {
          const sport = row["Sport"];
          const winnings = row.Winnings_Non_Ticket + row.Winnings_Ticket;
          acc[sport] = (acc[sport] || 0) + winnings;
          return acc;
        }, {});

        const chartDataArray = Object.entries(winningsBySport).map(([sport, totalWinnings]) => ({
          sport,
          totalWinnings,
        }));
        setChartData(chartDataArray);
      },
    });
  };

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
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalWinnings" fill="#1976d2" />
            </BarChart>
          </ResponsiveContainer>

          <Typography variant="h5" gutterBottom sx={{ marginTop: 4 }}>
            Uploaded Data Table
          </Typography>
          <TableContainer component={Paper} sx={{ marginTop: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  {Object.keys(data[0]).map((key) => (
                    <TableCell key={key}>{key}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, index) => (
                  <TableRow key={index}>
                    {Object.values(row).map((value, i) => (
                      <TableCell key={i}>{value}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
}

export default App;