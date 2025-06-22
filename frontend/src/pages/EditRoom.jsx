import React, { useState, useEffect } from "react";
import {
    Button,
    Grid,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Typography,
    TextField,
    Radio,
    RadioGroup,
    Collapse,
    Alert,
} from "@mui/material";
import { useParams } from "react-router-dom";

function EditRoom({ roomDetails, toggleSettings, updateRoomData }) {
    const { roomCode } = useParams();

    const [formData, setFormData] = useState({
        guestCanPause: roomDetails?.guestCanPause || false,
        votesToSkip: roomDetails?.votesToSkip || 2,
    });

    const [collapseOpen, setCollapseOpen] = useState(false); // Controls Collapse visibility
    const [alertMessage, setAlertMessage] = useState(""); // Message to show on success/error
    const [alertSeverity, setAlertSeverity] = useState("success"); // Success or error message

    useEffect(() => {
        if (roomDetails) {
            setFormData({
                votesToSkip: roomDetails.votesToSkip,
                guestCanPause: roomDetails.guestCanPause,
            });
        }
    }, [roomDetails]);

    const handleUpdateRoom = () => {
        const requestOptions = {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                votes_to_skip: formData.votesToSkip,
                guest_can_pause: formData.guestCanPause,
                code: roomCode,
            }),
        };

        fetch("/api/update-room", requestOptions)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Failed to update room settings.");
                }
            })
            .then((data) => {
                setAlertMessage("Room settings updated successfully!");
                setAlertSeverity("success"); // Success alert
                setCollapseOpen(true); // Show message
                updateRoomData(); // Update parent component
            })
            .catch((error) => {
                setAlertMessage(
                    error.message || "Failed to update room settings."
                );
                setAlertSeverity("error"); // Error alert
                setCollapseOpen(true); // Show message
            });
    };

    return (
        <Grid container spacing={1}>
            <Grid size={12} align="center">
                <Typography component="h4" variant="h4">
                    Edit Room : {roomCode}
                </Typography>
            </Grid>

            {/* Success/Error Message Collapse */}
            <Grid size={12} align="center">
                <Collapse in={collapseOpen}>
                    <Alert
                        severity={alertSeverity}
                        onClose={() => setCollapseOpen(false)}
                    >
                        {alertMessage}
                    </Alert>
                </Collapse>
            </Grid>

            <Grid size={12} align="center">
                <FormControl component="fieldset">
                    <FormHelperText align="center">
                        Guest Control of Playback State
                    </FormHelperText>
                    <RadioGroup
                        row
                        value={formData.guestCanPause.toString()}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                guestCanPause: e.target.value === "true",
                            })
                        }
                    >
                        <FormControlLabel
                            value="true"
                            control={<Radio color="primary" />}
                            label="Play/Pause"
                            labelPlacement="bottom"
                        />
                        <FormControlLabel
                            value="false"
                            control={<Radio color="secondary" />}
                            label="No Control"
                            labelPlacement="bottom"
                        />
                    </RadioGroup>
                </FormControl>

                <Grid size={12} align="center">
                    <FormControl>
                        <TextField
                            required
                            type="number"
                            value={formData.votesToSkip}
                            inputProps={{
                                min: 1,
                                style: { textAlign: "center" },
                            }}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    votesToSkip: e.target.value,
                                })
                            }
                        />
                        <FormHelperText align="center">
                            Votes required to skip songs
                        </FormHelperText>
                    </FormControl>
                </Grid>
                <Grid size={12} align="center">
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={handleUpdateRoom}
                    >
                        Update Room
                    </Button>
                </Grid>
                <Grid size={12} align="center">
                    <Button
                        color="secondary"
                        variant="contained"
                        onClick={() => toggleSettings(false)}
                    >
                        Close
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default EditRoom;
