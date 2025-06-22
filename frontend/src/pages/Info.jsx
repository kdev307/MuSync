import React, { useState } from "react";
import {
    Grid,
    Button,
    Typography,
    IconButton,
    List,
    ListItem,
    ListItemText,
} from "@mui/material";
import { NavigateBefore, NavigateNext } from "@mui/icons-material";
import { Link } from "react-router-dom";

const pages = {
    JOIN: "pages.join",
    CREATE: "pages.create",
};

function Info() {
    const [page, setPage] = useState(pages.JOIN);

    const info = {
        main: {
            description:
                "MuSync is a music synchronization app that allows users to create and join rooms to listen to music together in real-time.",
            features: [
                "Create and join rooms",
                "Control playback state",
                "Vote to skip tracks",
                "Enable or disable guest control",
            ],
        },
        join: {
            title: "Joining a Room",
            details:
                "Enter the room code shared by the host to join a MuSync session. Once you're in, you can listen to the same music as everyone else in real-time.",
            features: [
                "Sync with host’s current track",
                "Live updates of the song queue",
                "Vote to skip the current song",
                "Guest controls if enabled by host",
            ],
        },
        create: {
            title: "Creating a Room",
            details:
                "Create your own MuSync room and control how guests interact. You'll need a Spotify Premium account to play music through the app.",
            features: [
                "Full playback control",
                "Set number of votes needed to skip",
                "Allow or restrict guest control",
                "Manage room settings anytime",
            ],
        },
    };

    return (
        <Grid container spacing={1}>
            <Grid size={12} align="center">
                <Typography variant="h4" component="h4" gutterBottom>
                    What is MuSync ?
                </Typography>
                <Typography variant="body1" component="p" gutterBottom>
                    {info.main.description}
                </Typography>
            </Grid>

            <Grid
                size={12}
                md={8}
                sx={{ textAlign: "center", mx: "auto", mt: 6 }}
            >
                <Typography variant="h5" sx={{ mb: 1 }}>
                    {page === pages.JOIN ? info.join.title : info.create.title}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                    {page === pages.JOIN
                        ? info.join.details
                        : info.create.details}
                </Typography>

                <List
                    component="ul"
                    sx={{
                        display: "inline-block",
                        textAlign: "left",
                        paddingLeft: 2,
                        listStyleType: "disc",
                    }}
                >
                    {(page === pages.JOIN
                        ? info.join.features
                        : info.create.features
                    ).map((feature, index) => (
                        <ListItem
                            key={index}
                            disablePadding
                            sx={{ display: "list-item", paddingLeft: 1 }}
                        >
                            <ListItemText primary={feature} />
                        </ListItem>
                    ))}
                </List>
            </Grid>

            <Grid size={12} align="center">
                <IconButton
                    onClick={() =>
                        setPage(page === pages.JOIN ? pages.CREATE : pages.JOIN)
                    }
                >
                    {page === pages.JOIN ? (
                        <NavigateNext />
                    ) : (
                        <NavigateBefore />
                    )}
                </IconButton>
            </Grid>

            <Grid size={12} align="center">
                <Button
                    color="secondary"
                    to="/"
                    component={Link}
                    variant="contained"
                >
                    Back
                </Button>
            </Grid>
        </Grid>
    );
}

export default Info;
