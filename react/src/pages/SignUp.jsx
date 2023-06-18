import React, { useState } from "react";
import { CenteredBox } from "../styles/CustomizedStyles";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { centerContents } from "../styles/Styles";
import { Link } from "react-router-dom";
import { useStateContext } from "../components/contexts/ContextProvider";
import SnackBar from "../components/reusableComponents/SnackBar";
import api from "../configs/api";

export default function SignUp() {
    const { setUser, handleSetToken } = useStateContext();
    const [signUpData, setSignUpData] = useState([
        {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
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

    const handleSignUpClick = async () => {
        const response = await api.post("/signup", { signUpData });
        if (response.ok) {
            handleSetSnackBarData(true, response.data.message, "success");
            setUser(response.data.user);
            handleSetToken(response.data.token);
        } else {
            handleSetSnackBarData(true, response.data.message, "error");
        }
    };

    const handleTextfieldOnchange = (event, field) => {
        setSignUpData((prevState) => ({
            ...prevState,
            [field]: event,
        }));
    };

    return (
        <Box sx={CenteredBox}>
            <Box borderColor="black" border={1} padding={1} width="300px">
                <Grid Grid container spacing={2} sx={centerContents}>
                    <Grid item xs={12} md={12}>
                        <Typography variant="h4" fontWeight="bold">Sign Up</Typography>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <TextField
                            size="small"
                            onChange={(event) =>
                                handleTextfieldOnchange(
                                    event.target.value,
                                    "name"
                                )
                            }
                            value={signUpData.name}
                            label="Full Name"
                        ></TextField>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <TextField
                            size="small"
                            onChange={(event) =>
                                handleTextfieldOnchange(
                                    event.target.value,
                                    "email"
                                )
                            }
                            value={signUpData.email}
                            label="Email"
                            type="email"
                        ></TextField>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <TextField
                            size="small"
                            onChange={(event) =>
                                handleTextfieldOnchange(
                                    event.target.value,
                                    "password"
                                )
                            }
                            value={signUpData.password}
                            label="Password"
                            type="password"
                        ></TextField>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <TextField
                            size="small"
                            onChange={(event) =>
                                handleTextfieldOnchange(
                                    event.target.value,
                                    "confirmPassword"
                                )
                            }
                            value={signUpData.confirmPassword}
                            label="Confirm Password"
                            type="password"
                        ></TextField>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Button
                            variant="contained"
                            onClick={(event) => handleSignUpClick()}
                        >
                            Sign Up
                        </Button>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Typography variant="body2">
                            {" "}
                            Already Registered? <Link to="/login">Sign in</Link>
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
