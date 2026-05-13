import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button } from "@mui/material";

const LoginPage = ({ onHandleLogin, user }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if(user) {
            navigate("/blogs");
        }
    }, [user, navigate])

    

    const handleSubmit = (e, username, password) => {
        setUsername("");
        setPassword("");
        onHandleLogin(e, username, password);
        navigate("/blogs");
    }

    return (
        <div>
            <h2>Login to application</h2>
            <form onSubmit={(e) => handleSubmit(e, username, password)}>
                <div>
                    <TextField label="username" value={username} onChange={event => setUsername(event.target.value)} variant="standard"/>
                </div>
                <div>
                    <TextField type="password" label="password" value={password} onChange={event => setPassword(event.target.value)} variant="standard"/>
                </div>
                
                
            {/* <label>
                Username: <input type='text' value={username} onChange={event => setUsername(event.target.value)} />
            </label>
            <label>
                Password <input type='password' value={password} onChange={event => setPassword(event.target.value)} />
            </label> */}
            <Button sx={{ marginTop: "10px" }} type='submit' variant="contained">login</Button>
            </form>
        </div>
    )
}

export default LoginPage;