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
        song: {},
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

    const getCurrentSong = () => {
        fetch("/spotify/current-song", {
            method: "GET",
            credentials: "include",
        })
            .then((response) => {
                if (response.status === 204 || !response.ok) return {};
                return response.json();
            })
            .then((data) => {
                setRoomDetails((prevDetails) => ({
                    ...prevDetails,
                    song: data,
                }));

                console.log("Room Songs:", roomDetails.song);
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

    // useEffect(() => {
    //     getRoomDetails();
    //     getCurrentSong();
    //     const interval = setInterval(getCurrentSong, 1000);
    //     authenticateSpotify();
    //     return () => clearInterval(interval);
    // }, []);

    useEffect(() => {
        getRoomDetails();
        authenticateSpotify();
    }, [roomCode]);

    useEffect(() => {
        getCurrentSong();
        const interval = setInterval(getCurrentSong, 10000);
        return () => clearInterval(interval);
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
    console.log("Room details:", roomDetails);
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
            {/* <Grid item xs={12} align="center">
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
            </Grid> */}
            {roomDetails.song && Object.keys(roomDetails.song).length > 0 ? (
                <Grid item xs={12} align="center">
                    <Typography variant="h5">
                        {roomDetails.song.title}
                    </Typography>
                    <Typography variant="h6">
                        {roomDetails.song.artists}
                    </Typography>
                    <Typography variant="body1">
                        {roomDetails.song.album}
                    </Typography>
                    <img
                        src={roomDetails.song.image_url}
                        alt={roomDetails.song.album + " cover"}
                        style={{ width: "360px", height: "360px" }}
                    />
                </Grid>
            ) : (
                <Grid item xs={12} align="center">
                    <Typography variant="h6" component="h6">
                        No song is currently playing
                    </Typography>
                </Grid>
            )}
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
