import React, { useState } from "react";
import {
    Grid,
    Typography,
    Card,
    IconButton,
    LinearProgress,
    Snackbar,
    Alert,
} from "@mui/material";

import { PlayArrow, Pause, SkipNext } from "@mui/icons-material";

function MusicPlayer({ song }) {
    const [error, setError] = useState("");

    const handleError = (message) => {
        setError(message);
    };
    const pauseSong = () => {
        fetch("/spotify/pause", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        })
            .then(async (res) => {
                if (!res.ok) {
                    const data = await res.json();
                    const message =
                        data.error?.message ||
                        "Spotify Premium is required to access the song player.";
                    handleError(message);
                }
            })
            .catch(() => {
                handleError("Failed to connect to Spotify.");
            });
    };

    const playSong = () => {
        fetch("/spotify/play", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        })
            .then((res) => {
                if (!res.ok) {
                    handleError(
                        "Spotify Premium is required to access the song player."
                    );
                }
            })
            .catch(() => {
                handleError("Failed to connect to Spotify.");
            });
    };

    const skipSong = () => {
        fetch("/spotify/skip", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        })
            .then((res) => {
                if (!res.ok) {
                    handleError(
                        "Spotify Premium is required to access the song player."
                    );
                }
            })
            .catch(() => {
                handleError("Failed to connect to Spotify.");
            });
    };

    const songProgress = (song.time / song.duration) * 100;
    return (
        <>
            <Card>
                <Grid container alignItems="center">
                    <Grid size={4} align="center">
                        <img
                            src={song.image_url}
                            alt={song.album + " cover"}
                            height="100%"
                            width="100%"
                        />
                    </Grid>
                    <Grid size={8} align="center">
                        <Typography component="h5" variant="h5">
                            {song.title}
                        </Typography>
                        <Typography color="textSecondary" variant="subtitle1">
                            {song.artists}
                        </Typography>
                        <Typography
                            component="h6"
                            color="textPrimary"
                            variant="h6"
                        >
                            {song.album}
                        </Typography>
                        <div>
                            {/* <IconButton>
                                <SkipPrevious />
                            </IconButton> */}
                            <IconButton
                                onClick={song.is_playing ? pauseSong : playSong}
                            >
                                {song.is_playing ? <Pause /> : <PlayArrow />}
                            </IconButton>
                            <IconButton onClick={skipSong}>
                                {song.votes} / {song.votes_required}
                                <SkipNext />
                            </IconButton>
                        </div>
                    </Grid>
                </Grid>
                <LinearProgress variant="determinate" value={songProgress} />
            </Card>
            <Snackbar
                open={!!error}
                autoHideDuration={3000}
                onClose={(event, reason) => {
                    if (reason === "clickaway") {
                        return;
                    }
                    setError("");
                }}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert severity="error" onClose={() => setError("")}>
                    {error}
                </Alert>
            </Snackbar>
        </>
    );
}

export default MusicPlayer;
