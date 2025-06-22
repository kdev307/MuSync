import React from "react";
import {
    Grid,
    Typography,
    Card,
    IconButton,
    LinearProgress,
} from "@mui/material";

import { PlayArrow, Pause, SkipNext, SkipPrevious } from "@mui/icons-material";

function MusicPlayer({ song, isPlaying }) {
    const songProgress = (song.time / song.duration) * 100;
    return (
        <Card>
            <Grid container alignItems="center">
                <Grid item xs={4} align="center">
                    <img
                        src={song.image_url}
                        alt={song.album + " cover"}
                        height="100%"
                        width="100%"
                    />
                </Grid>
                <Grid item xs={8} align="center">
                    <Typography component="h5" variant="h5">
                        {song.title}
                    </Typography>
                    <Typography color="textSecondary" variant="subtitle1">
                        {song.artists}
                    </Typography>
                    <Typography component="h6" color="textPrimary" variant="h6">
                        {song.album}
                    </Typography>
                    <div>
                        <IconButton>
                            <SkipPrevious />
                        </IconButton>
                        <IconButton>
                            {isPlaying ? <Pause /> : <PlayArrow />}
                        </IconButton>
                        <IconButton>
                            <SkipNext />
                        </IconButton>
                    </div>
                </Grid>
            </Grid>
            <LinearProgress variant="determinate" value={songProgress} />
        </Card>
    );
}

export default MusicPlayer;
