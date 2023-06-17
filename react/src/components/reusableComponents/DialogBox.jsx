import React, { Fragment } from "react";
import {
    Dialog, Grid, IconButton,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
const DialogBox = (props) => {

    return (
        <Fragment>
            <Dialog open={props.open} fullWidth maxWidth={props.maxWidth}>
                <Grid container>
                    <Grid item xs={12 } md={12 } lg={ 12} container justifyContent={"flex-end"}>
                        <IconButton onClick={props.onClose}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Grid>
                </Grid>
                {props.children}
                {props.content}
            </Dialog>
        </Fragment>
    );
}
export default DialogBox;