import React, { useState } from "react";
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
import { Link, useNavigate } from "react-router-dom";

function CreateRoom() {
    const defaultVotes = 2;
    const [formData, setFormData] = useState({
        guestCanPause: true,
        votesToSkip: defaultVotes,
    });

    const navigate = useNavigate();

    const handeCreateRoom = () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                votes_to_skip: formData.votesToSkip,
                guest_can_pause: formData.guestCanPause,
            }),
        };
        fetch("http://localhost:8000/api/create-room", requestOptions)
            .then((response) => response.json())
            .then((data) => {
                navigate(`/room/${data.code}`);
            });
    };

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Typography component="h4" variant="h4">
                    Create a Room
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
                        defaultValue="true"
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
                            defaultValue={defaultVotes}
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
                        onClick={handeCreateRoom}
                    >
                        Create A Room
                    </Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button
                        color="secondary"
                        variant="contained"
                        to="/"
                        component={Link}
                    >
                        Go Back
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default CreateRoom;
