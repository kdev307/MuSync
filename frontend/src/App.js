import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateRoom from "./pages/CreateRoom";
import Home from "./pages/Home";
import RoomJoin from "./pages/RoomJoin";
import Room from "./pages/Room";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />

                    <Route path="/join-room" element={<RoomJoin />} />

                    <Route path="/create-room" element={<CreateRoom />} />
                    <Route path="/room/:roomCode" element={<Room />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
