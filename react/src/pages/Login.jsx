import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import React from "react";
import { centerContents } from "../styles/Styles";
import { CenteredBox } from "../styles/CustomizedStyles";
import { Link } from "react-router-dom";

export default function Login() {
    return (
        <Box sx={CenteredBox}>
            <Box borderColor="black" border={1} padding={1} width="300px">
                <Grid Grid container spacing={2} sx={centerContents}>
                    <Grid item xs={12} md={12}>
                        <Typography variant="h4">Login</Typography>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <TextField label="Email" type="email"></TextField>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <TextField label="Password" type="password"></TextField>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Button variant="contained">Login</Button>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Typography variant="body2">
                            {" "}
                            Not Registered?{" "}
                            <Link to="/sign-up">Create an account</Link>
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}
