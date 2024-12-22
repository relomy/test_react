import React from "react";
import { Button } from "@mui/material";

const UploadButton = ({ onFileUpload }) => (
    <Button variant="contained" component="label" sx={{ marginBottom: 2 }}>
        Upload CSV
        <input type="file" accept=".csv" hidden onChange={onFileUpload} />
    </Button>
);

export default UploadButton;