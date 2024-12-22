import React from "react";
import { Grid, FormControl, InputLabel, Select, MenuItem, TextField, Button } from "@mui/material";

const Filters = ({
    data,
    selectedSport,
    setSelectedSport,
    selectedDateRange,
    setSelectedDateRange,
    searchText,
    setSearchText,
    handleFilter,
    handleResetFilters,
}) => (
    <>
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
    </>
);

export default Filters;