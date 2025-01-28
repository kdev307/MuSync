import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateRoom from "./pages/CreateRoom";
import Home from "./pages/Home";
import RoomJoin from "./pages/RoomJoin";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />

                    <Route path="/join-room" element={<RoomJoin />} />

                    <Route path="/create-room" element={<CreateRoom />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
