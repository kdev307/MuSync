import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Grid, Typography, Button } from "@mui/material";
import EditRoom from "./EditRoom";

function Room() {
    const { roomCode } = useParams();
    const navigate = useNavigate();
    const [roomDetails, setRoomDetails] = useState({
        votesToSkip: 2,
        guestCanPause: false,
        isHost: false,
        showSettings: false,
        spotifyAuthenticated: false,
    });

    const authenticateSpotify = () => {
        fetch(`/spotify/is-authenticated`)
            .then((response) => response.json())
            .then((data) => {
                console.log("Raw response from getRoomDetails:", data);
                setRoomDetails((prevDetails) => ({
                    ...prevDetails,
                    spotifyAuthenticated: data.status,
                }));
                if (!data.status) {
                    fetch("/spotify/get-auth-url")
                        .then((response) => response.json())
                        .then((data) => {
                            window.location.replace(data.url);
                        });
                }
                //  else {
                //     // window.location.href = `http://localhost:3000/room/${roomCode}/`;
                //     getRoomDetails();
                // }
            });
    };

    const getRoomDetails = () => {
        fetch(`/api/get-room?code=${roomCode}`)
            .then((response) => {
                if (!response.ok) navigate("/");
                return response.json();
            })
            .then((data) => {
                setRoomDetails((prevDetails) => ({
                    ...prevDetails,
                    votesToSkip: data.votes_to_skip,
                    guestCanPause: data.guest_can_pause,
                    isHost: data.is_host,
                }));
                if (data.is_host) {
                    authenticateSpotify();
                }
            });
    };

    useEffect(() => {
        getRoomDetails();
        // authenticateSpotify();
    }, [roomCode]);

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

    if (roomDetails.showSettings) {
        return (
            <EditRoom
                roomDetails={roomDetails}
                toggleSettings={toggleSettings}
                updateRoomData={getRoomDetails}
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

export default Room;
