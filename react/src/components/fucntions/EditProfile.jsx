import * as React from "react";
import {
    Button,
    TextField,
    DialogActions,
    Grid,
    Box,
    DialogContent,
    DialogTitle,
    Typography,
    Divider,
    Avatar,
} from "@mui/material";
import { useState, Fragment, useEffect } from "react";
import ConfirmationButtons from "../reusableComponents/ConfirmationButtons";
import { useStateContext } from "../contexts/ContextProvider";
import api from "../../configs/api";
import { centerContents } from "../../styles/Styles";

const EditProfile = ({ snackBarData, onClose }) => {
    const [confirmationButtons, setConfirmationButtons] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [userDetails, setUserDetails] = useState([]);
    const [passwordDetails, setPasswordDetails] = useState([]);

    const { user, setUser, handleSetToken } = useStateContext();

    const handleConfirmation = () => {
        setConfirmationButtons(true);
    };

    const handleImageChange = (event) => {
        let file = event.target.files[0];
        let reader = new FileReader();
        let limit = 1024 * 1024 * 10; // 10MB
        if (!file.type.startsWith("image/")) {
            snackBarData(true, "error", "Please select an image file.");
            return;
        } else if (file.size > limit) {
            snackBarData(true, "error", "The image size limit is 10MB.");
            return;
        } else {
            reader.onloadend = () => {
                const value = reader.result;
                setUserDetails({ ...userDetails, image: value });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleConfirmClick = async (event) => {
        setIsLoading(true);
        event.preventDefault();

        const response = await api.put("/edit-profile", {
            userDetails,
            passwordDetails,
        });

        if (response.ok) {
            snackBarData(true, response.data.message, "success");
            console.log(response.data);
            if (response.data.resetToken) {
              handleSetToken(null);
            }
            setUser(response.data.user);
            onClose();
        } else {
            setIsLoading(false);
            setConfirmationButtons(false);
            snackBarData(true, response.data.message, "error");
        }
    };

    useEffect(() => {
        setUserDetails({
            userId: user?.id,
            name: user?.name,
            email: user?.email,
            image: null,
        });
    }, [user]);

    return (
        <Fragment>
            <DialogTitle>Edit Profile</DialogTitle>

            <DialogContent>
                <Grid container spacing={1} padding={2} borderRadius={"20px"}>
                    <Grid item xs={12} md={3} marginBottom={1}>
                        <Box sx={centerContents}>
                            <Avatar
                                src={
                                    userDetails.image ||
                                    `${user?.url}profiles/${user?.image}`
                                }
                                sx={{
                                    height: "170px",
                                    width: "170px",
                                }}
                            />
                        </Box>

                        <Box marginTop="20px" sx={centerContents}>
                            <Button
                                variant="contained"
                                component="label"
                                color="info"
                            >
                                Upload Image
                                <input
                                    type="file"
                                    onChange={(event) =>
                                        handleImageChange(event)
                                    }
                                    style={{
                                        display: "none",
                                    }}
                                />
                            </Button>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={4} marginLeft={1} marginRight={2}>
                        <Typography
                            variant="h6"
                            marginBottom={2}
                            sx={{ color: "#E74C3C" }}
                        >
                            Account Information{" "}
                        </Typography>

                        <TextField
                            id="name"
                            name="name"
                            label="Name"
                            variant="outlined"
                            fullWidth
                            value={userDetails.name}
                            onChange={(event) =>
                                setUserDetails({
                                    ...userDetails,
                                    name: event.target.value,
                                })
                            }
                            sx={{ marginBottom: 3 }}
                        />

                        <TextField
                            id="name"
                            name="name"
                            label="Email"
                            variant="outlined"
                            fullWidth
                            value={userDetails.email}
                            onChange={(event) =>
                                setUserDetails({
                                    ...userDetails,
                                    email: event.target.value,
                                })
                            }
                        />
                    </Grid>
                    <Divider orientation="vertical" flexItem />

                    <Grid item xs={12} md={4} marginBottom={1} marginLeft={1}>
                        <Typography
                            variant="h6"
                            marginBottom={3}
                            sx={{ color: "#E74C3C" }}
                        >
                            Change Password{" "}
                        </Typography>
                        <TextField
                            id="oldPassword"
                            name="oldPassword"
                            label="Enter old password"
                            size="small"
                            variant="outlined"
                            type="password"
                            fullWidth
                            value={passwordDetails.oldPassword}
                            onChange={(event) =>
                                setPasswordDetails({
                                    ...passwordDetails,
                                    oldPassword: event.target.value,
                                })
                            }
                            sx={{ marginBottom: 3 }}
                        />

                        <TextField
                            id="newPassword"
                            name="newPassword"
                            label="Enter new password"
                            size="small"
                            variant="outlined"
                            type="password"
                            fullWidth
                            value={passwordDetails.newPassword}
                            onChange={(event) =>
                                setPasswordDetails({
                                    ...passwordDetails,
                                    newPassword: event.target.value,
                                })
                            }
                            sx={{ marginBottom: 3 }}
                        />

                        <TextField
                            id="confirmNewPassword"
                            name="confirmNewPassword"
                            label="Confirm new password"
                            size="small"
                            variant="outlined"
                            type="password"
                            fullWidth
                            value={passwordDetails.confirmPassword}
                            onChange={(event) =>
                                setPasswordDetails({
                                    ...passwordDetails,
                                    confirmPassword: event.target.value,
                                })
                            }
                            sx={{ marginBottom: 3 }}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                {confirmationButtons ? (
                    <ConfirmationButtons
                        loading={isLoading}
                        save={handleConfirmClick}
                        onClose={() => setConfirmationButtons(false)}
                    />
                ) : (
                    <Button
                        color="success"
                        variant="contained"
                        onClick={() => {
                            handleConfirmation();
                        }}
                    >
                        Save
                    </Button>
                )}
            </DialogActions>
        </Fragment>
    );
};
export default EditProfile;
