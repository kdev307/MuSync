import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Room() {
    const [roomData, setRoomData] = useState({
        votesToSkip: 2,
        guestCanPause: false,
        isHost: false,
    });
    const { roomCode } = useParams();

    useEffect(() => {
        getRoomDetails();
    }, [roomCode]);

    const getRoomDetails = () => {
        fetch(`/api/get-room?code=${roomCode}`)
            .then((response) => response.json())
            .then((data) => {
                setRoomData({
                    votesToSkip: data.votes_to_skip,
                    guestCanPause: data.guest_can_pause,
                    isHost: data.is_host,
                });
            });
    };
    return (
        <div>
            <h3>{roomCode}</h3>
            <div>Votes: {roomData.votesToSkip}</div>
            <div>Guest Can Pause: {roomData.guestCanPause.toString()}</div>
            <div>Host: {roomData.isHost.toString()}</div>
        </div>
    );
}

export default Room;
