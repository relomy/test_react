import React from "react";
import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const DataTable = ({ rows, columns }) => {
    // Ensure specific columns are hidden by default
    const updatedColumns = columns.map((column) => {
        if (["Game_Type", "Entry_Key", "Contest_Key"].includes(column.field)) {
            return { ...column, hide: true };
        }
        return column;
    });

    return (
        <Box sx={{ height: 400, width: "100%", marginTop: 2 }}>
            <DataGrid
                rows={rows}
                columns={updatedColumns}
                pageSize={10}
                rowsPerPageOptions={[10, 25, 50]}
                disableSelectionOnClick
                components={{
                    NoRowsOverlay: () => <Typography>No data matching the filter</Typography>,
                }}
            />
        </Box>
    );
};

export default DataTable;