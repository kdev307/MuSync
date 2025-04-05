import React, { useEffect, useState } from "react";
import { Grid, Button, ButtonGroup, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

function Home() {
    const [roomCode, setRoomCode] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("/api/user-in-room")
            .then((response) => response.json())
            .then((data) => {
                setRoomCode(data.code);
            });
    }, []);

    useEffect(() => {
        if (roomCode) {
            navigate(`/room/${roomCode}`);
        }
    }, [roomCode, navigate]);

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} align="center">
                <Typography variant="h3" component="h3">
                    HouseParty
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <ButtonGroup variant="contained" color="primary">
                    <Button color="primary" to="/join-room" component={Link}>
                        Join a Room
                    </Button>
                    <Button
                        color="secondary"
                        to="/create-room"
                        component={Link}
                    >
                        Create a Room
                    </Button>
                </ButtonGroup>
            </Grid>
        </Grid>
    );
}

export default Home;
