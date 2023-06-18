import { Box, Button, Grid, Paper, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { centerContents } from "../styles/Styles";
import axios from "axios";
import api from "../configs/api";

export default function RestApiQuery() {
    const [url, setUrl] = useState("");
    const [response, setResponse] = useState("");
    const [reversedResponse, setReversedResponse] = useState("");

    const handleTextfieldOnchange = (event) => {
        setUrl(event);
    };

    const handleQueryClick = async () => {
        const response = await axios.get(url);
        if (response.status == 200) {
            const urlData = response.data;
            const res = await api.post("/query", { urlData });
            console.log("Response", res.data);
            setResponse(res.data.originalResponse);
            setReversedResponse(res.data.processedResult);
        } else {
        }
    };

    function renderJSON(response) {
        if (response) {
            return (
                <pre
                    style={{
                        whiteSpace: "pre-wrap",
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                    }}
                >
                    {JSON.stringify(response, null, 2)}
                </pre>
            );
        }
        return null;
    }

    return (
        <Box padding={1}>
            <Box border={2} borderColor="black" padding={1}>
                <Box sx={centerContents} marginTop={1} padding={2}>
                    <Typography variant="h4" marginRight={2}>
                        URL:{" "}
                    </Typography>
                    <TextField
                        label="API URL"
                        variant="filled"
                        value={url}
                        fullWidth
                        onChange={(event) =>
                            handleTextfieldOnchange(event.target.value)
                        }
                        sx={{ marginRight: "20px" }}
                    />
                    <Button
                        variant="contained"
                        onClick={(event) => handleQueryClick()}
                    >
                        Query
                    </Button>
                </Box>
                <Grid container padding={1} spacing={1}>
                    <Grid item xs={12} md={6}>
                        <Typography>URL Response</Typography>
                        <Paper
                            elevation={3}
                            variant="outlined"
                            style={{
                                minHeight: "60vh",
                                border: "1px solid #000000",
                                padding: "10px",
                            }}
                        >
                            {renderJSON(response)}
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography>Inverted URL Response</Typography>
                        <Paper
                            elevation={3}
                            variant="outlined"
                            style={{
                                minHeight: "60vh",
                                border: "1px solid #000000",
                                padding: "10px",
                            }}
                        >
                            {renderJSON(reversedResponse)}
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}
