import React, { Fragment, useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useStateContext } from "./contexts/ContextProvider";
import {
    Box,
    Typography,
    AppBar,
    Toolbar,
    IconButton,
    Menu,
    Avatar,
    Button,
    Tooltip,
    MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AdbIcon from "@mui/icons-material/Adb";
import { NavBarDisplayName } from "../styles/CustomizedStyles";
import { hiddenOnMobile } from "../styles/Styles";
import api from "../configs/api";
import SnackBar from "./reusableComponents/SnackBar";
import DialogBox from "./reusableComponents/DialogBox";
import EditProfile from "./fucntions/EditProfile";

export default function DefaultLayout() {
    const { user, token, setUser, handleSetToken } = useStateContext();
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const pages = ["Rest Api Query"];
    const settings = ["Profile", "Account", "Logout"];
    const [dialogBoxData, setDialogBoxData] = useState([
        {
            open: false,
            content: "",
            size: "",
        },
    ]);
    const [snackBarData, setSnackBarData] = useState([
        {
            open: false,
            message: "",
            severity: "",
        },
    ]);

    const handleOpenDialogBox = () => {
        setDialogBoxData((prevState) => ({
            ...prevState,
            open: true,
            content: (
                <EditProfile
                    snackBarData={handleSetSnackBarData}
                    onClose={handleCloseDialogBox}
                />
            ),
            size: "xl",
        }));
    };

    const handleCloseDialogBox = () => {
        setDialogBoxData((prevState) => ({
            ...prevState,
            open: false,
        }));
    };

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

    const navigate = useNavigate();

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = (page) => {
        setAnchorElNav(null);
        if (page != "Close") {
            localStorage.setItem("TITLE", page);
        }
        if (page == "Profile") {
            navigate("/dashboard");
        } else if (page == "Users") {
            navigate("/users");
        }
        else if (page == "Rest Api Query") {
            navigate("/rest-api-query");
        }
    };

    const handleCloseUserMenu = (setting) => {
        setAnchorElUser(null);
        if (setting == "Profile") {
            handleOpenDialogBox();
        } else if (setting == "Logout") {
            api.post("/logout").then(() => {
                setUser();
                handleSetToken(null);
            });
        }
    };

    // if (!token) {
    //     return <Navigate to="/login" />;
    // }

    return (
        <Box>
            <AppBar position="static">
                <Toolbar>
                    <AdbIcon
                        sx={{
                            display: { xs: "none", md: "flex" },
                            mr: 1,
                        }}
                    />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: "none", md: "flex" },
                            fontFamily: "monospace",
                            fontWeight: 700,
                            letterSpacing: ".3rem",
                            color: "inherit",
                            textDecoration: "none",
                        }}
                    >
                        {localStorage.getItem("TITLE")}
                    </Typography>

                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: "flex", md: "none" },
                        }}
                    >
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "left",
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={(event) => handleCloseNavMenu("Close")}
                            sx={{
                                display: { xs: "block", md: "none" },
                            }}
                        >
                            {pages.map((page) => (
                                <MenuItem
                                    key={page}
                                    onClick={(event) =>
                                        handleCloseNavMenu(page)
                                    }
                                >
                                    <Typography textAlign="center">
                                        {page}
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <AdbIcon
                        sx={{
                            display: { xs: "flex", md: "none" },
                            mr: 1,
                        }}
                    />
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href=""
                        sx={{
                            mr: 2,
                            display: { xs: "flex", md: "none" },
                            flexGrow: 1,
                            fontFamily: "monospace",
                            fontWeight: 700,
                            letterSpacing: ".3rem",
                            color: "inherit",
                            textDecoration: "none",
                        }}
                    >
                        {localStorage.getItem("TITLE")}
                    </Typography>
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: "none", md: "flex" },
                        }}
                    >
                        {pages.map((page) => (
                            <Button
                                key={page}
                                onClick={(event) => handleCloseNavMenu(page)}
                                sx={{
                                    my: 2,
                                    color: "white",
                                    display: "block",
                                }}
                            >
                                {page}
                            </Button>
                        ))}
                    </Box>

                    <Box sx={NavBarDisplayName}>
                        <Typography marginRight={2} sx={hiddenOnMobile}>
                            Hi, {user?.name || ""}
                        </Typography>

                        <Tooltip title="Open settings">
                            <IconButton
                                onClick={handleOpenUserMenu}
                                sx={{ p: 0 }}
                            >
                                <Avatar
                                    alt="Remy Sharp"
                                    src="/static/images/avatar/2.jpg"
                                />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: "45px" }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            open={Boolean(anchorElUser)}
                            onClick={(event) => handleCloseUserMenu("Close")}
                        >
                            {settings.map((setting) => (
                                <MenuItem
                                    key={setting}
                                    onClick={(event) =>
                                        handleCloseUserMenu(setting)
                                    }
                                >
                                    <Typography textAlign="center">
                                        {setting}
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>
            <Outlet />
            <DialogBox
                open={dialogBoxData.open}
                onClose={handleCloseDialogBox}
                content={dialogBoxData.content}
                maxWidth={dialogBoxData.size}
            />
            <SnackBar
                open={snackBarData.open}
                message={snackBarData.message}
                severity={snackBarData.severity}
            />
        </Box>
    );
}
