import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { centerContents } from "../styles/Styles";
import { CenteredBox } from "../styles/CustomizedStyles";
import { Link } from "react-router-dom";
import { useStateContext } from "../components/contexts/ContextProvider";
import SnackBar from "../components/reusableComponents/SnackBar";
import api from "../configs/api";

export default function Login() {
    const { setUser, handleSetToken } = useStateContext();
    const [loginData, setLoginData] = useState([
        {
            email: "",
            password: "",
        },
    ]);
    const [snackBarData, setSnackBarData] = useState([
        {
            open: false,
            message: "",
            severity: "",
        },
    ]);

    const handleSetSnackBarData = (open, message, severity) => {
        setSnackBarData((prevState) => ({
            ...prevState,
            open: open,
            message: message,
            severity: severity,
        }));
        setTimeout(() => {
            setSnackBarData((prevState) => ({
                ...prevState,
                open: false,
            }));
        }, 3000);
    };

    const handleLoginClick = async () => {
        const response = await api.post("/login", { loginData });
        if (response.ok) {
            handleSetSnackBarData(true, response.data.message, "success");
            setUser(response.data.user);
            handleSetToken(response.data.token);
        } else {
            handleSetSnackBarData(true, response.data.message, "error");
        }
    };

    const handleTextfieldOnchange = (event, field) => {
        setLoginData((prevState) => ({
            ...prevState,
            [field]: event,
        }));
    };
    return (
        <Box sx={CenteredBox}>
            <Box borderColor="black" border={1} padding={1} width="300px">
                <Grid Grid container spacing={2} sx={centerContents}>
                    <Grid item xs={12} md={12}>
                        <Typography variant="h4" fontWeight="bold">Login</Typography>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <TextField
                            value={loginData.email}
                            onChange={(event) =>
                                handleTextfieldOnchange(
                                    event.target.value,
                                    "email"
                                )
                            }
                            label="Email"
                            type="email"
                        ></TextField>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <TextField
                            value={loginData.password}
                            onChange={(event) =>
                                handleTextfieldOnchange(
                                    event.target.value,
                                    "password"
                                )
                            }
                            label="Password"
                            type="password"
                        ></TextField>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Button
                            variant="contained"
                            onClick={(event) => handleLoginClick()}
                        >
                            Login
                        </Button>
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
            <SnackBar
                open={snackBarData.open}
                message={snackBarData.message}
                severity={snackBarData.severity}
            />
        </Box>
    );
}
