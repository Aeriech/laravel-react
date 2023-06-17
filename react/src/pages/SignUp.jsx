import React from "react";
import { CenteredBox } from "../styles/CustomizedStyles";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { centerContents } from "../styles/Styles";
import { Link } from "react-router-dom";

export default function SignUp() {
    return (
        <Box sx={CenteredBox}>
            <Box borderColor="black" border={1} padding={1} width="300px">
                <Grid Grid container spacing={2} sx={centerContents}>
                    <Grid item xs={12} md={12}>
                        <Typography variant="h4">Sign Up</Typography>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <TextField size="small" label="Full Name" type="email"></TextField>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <TextField size="small" label="Email" type="email"></TextField>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <TextField size="small" label="Password" type="password"></TextField>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <TextField size="small" label="Confirm Password" type="password"></TextField>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Button variant="contained">Sign Up</Button>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Typography variant="body2">
                            {" "}
                            Already Registered?{" "}
                            <Link to="/login">Sign in</Link>
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}
