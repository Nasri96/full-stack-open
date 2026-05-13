import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button } from "@mui/material";


const BlogForm = ({ createBlog, user }) => {
    const [blogTitle, setBlogTitle] = useState("");
    const [blogAuthor, setBlogAuthor] = useState("");
    const [blogUrl, setBlogUrl] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if(!user) {
            navigate("/login");
        }
    }, [user, navigate])

    const handleSubmit = (event) => {
        event.preventDefault();
        createBlog({ title: blogTitle, author: blogAuthor, url: blogUrl });
        setBlogTitle("");
        setBlogAuthor("");
        setBlogUrl("");
        navigate("/blogs");
    }

    const styleWidth = {
        width: "35%",
        marginTop: "10px"
    }

    return (
        <>
            <h2>create new</h2>
            <form onSubmit={handleSubmit}>
                <div style={styleWidth}>
                    <TextField fullWidth label="title" variant="outlined" type='text' value={blogTitle} onChange={(event) => setBlogTitle(event.target.value)} />
                </div>
                
                <div style={styleWidth}>
                    <TextField fullWidth label="author" variant="outlined" type='text' value={blogAuthor} onChange={(event) => setBlogAuthor(event.target.value)} />
                </div>

                <div style={styleWidth}>
                    <TextField fullWidth label="url" variant="outlined" type='text' value={blogUrl} onChange={(event) => setBlogUrl(event.target.value)} />
                </div>
                <Button sx={{ marginTop: "10px" }} type='submit' variant="contained">create</Button>
            </form>
        </>
        
    )
}

export default BlogForm;