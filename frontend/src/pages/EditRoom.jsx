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
} from "@material-ui/core";
import { useParams } from "react-router-dom";

function EditRoom({ roomDetails, toggleSettings }) {
    const { roomCode } = useParams();

    const [formData, setFormData] = useState({
        guestCanPause: roomDetails?.guestCanPause || false,
        votesToSkip: roomDetails?.votesToSkip || 2,
    });

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
            .then((response) => response.json())
            .then((data) => {
                console.log("Room updated:", data);
                toggleSettings(false);
            });
    };

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Typography component="h4" variant="h4">
                    Edit Room : ${roomCode}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl component="fieldset">
                    <FormHelperText>
                        <div align="center">
                            Guest Control of Playback State
                        </div>
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
                <Grid item xs={12} align="center">
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
                        <FormHelperText>
                            <div align="center">
                                Votes required to skip songs
                            </div>
                        </FormHelperText>
                    </FormControl>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={handleUpdateRoom}
                    >
                        Update Room
                    </Button>
                </Grid>
                <Grid item xs={12} align="center">
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
