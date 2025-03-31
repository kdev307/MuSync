import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Grid, Typography, Button } from "@material-ui/core";
import CreateRoom from "./CreateRoom";

function Room() {
    const { roomCode } = useParams();
    const navigate = useNavigate();
    const [roomDetails, setRoomDetails] = useState({
        votesToSkip: 2,
        guestCanPause: false,
        isHost: false,
        showSettings: false,
    });

    const getRoomDetails = () => {
        fetch(`/api/get-room?code=${roomCode}`)
            .then((response) => {
                if (!response.ok) navigate("/");
                return response.json();
            })
            .then((data) => {
                setRoomDetails({
                    votesToSkip: data.votes_to_skip,
                    guestCanPause: data.guest_can_pause,
                    isHost: data.is_host,
                });
            });
    };

    const leaveRoom = () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        };
        fetch("/api/leave-room", requestOptions).then((_response) => {
            navigate("/");
        });
    };

    const toggleSettings = (value) => {
        setRoomDetails({ ...roomDetails, showSettings: value });
    };

    useEffect(() => {
        getRoomDetails();
    }, [roomCode]);

    if (roomDetails.showSettings) {
        return (
            <Settings
                roomDetails={roomDetails}
                roomCode={roomCode}
                toggleSettings={toggleSettings}
            />
        );
    }

    return (
        <Grid
            container
            spacing={1}
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
            }}
        >
            <Grid item xs={12} align="center">
                <Typography variant="h4" component="h4">
                    Code: {roomCode}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="h6" component="h6">
                    Votes: {roomDetails.votesToSkip}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="h6" component="h6">
                    Guest Can Pause: {roomDetails.guestCanPause.toString()}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="h6" component="h6">
                    Host: {roomDetails.isHost.toString()}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                {roomDetails.isHost ? (
                    <Grid item xs={12} align="center">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => toggleSettings(true)}
                        >
                            Settings
                        </Button>
                    </Grid>
                ) : null}
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={leaveRoom}
                >
                    Leave Room
                </Button>
            </Grid>
        </Grid>
    );
}

function Settings({ roomDetails, roomCode, toggleSettings }) {
    const { votesToSkip, guestCanPause } = roomDetails;
    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <CreateRoom
                    update={true}
                    votesToSkip={votesToSkip}
                    guestCanPause={guestCanPause}
                    roomCode={roomCode}
                />
            </Grid>
            <Grid item xs={12} align="center">
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => toggleSettings(false)}
                >
                    Close
                </Button>
            </Grid>
        </Grid>
    );
}

export default Room;
