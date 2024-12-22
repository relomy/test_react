import React from "react";
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

const Chart = ({ chartData, currencyFormatter }) => (
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
);

export default Chart;