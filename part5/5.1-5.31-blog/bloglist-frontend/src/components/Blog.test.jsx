import { afterEach, test, expect, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";
import { MemoryRouter } from "react-router-dom";

afterEach(() => {
    cleanup();
})

test("Blog information and the number of likes are displayed to unauthenticated users, buttons are not displayed", () => {
    const blog = {
        title: "blog title",
        author: "blog author",
        url: "blog url",
        likes: 1,
        user: {
            username: "testusername",
            name: "testname"
        }
    }

    const user = null;

    const blogs = [blog];

    render(<MemoryRouter><Blog blogs={blogs} user={user} /></MemoryRouter>)

    const title = screen.getByText("blog title");
    const likes = screen.getByText("1 likes");
    const deleteButton = screen.queryByRole("button", { name: "remove" });
    
    expect(title).toBeDefined();
    expect(likes).toBeDefined();
    expect(deleteButton).toBeNull();
})

test("Authenticated users who are not the blog’s creator are shown only the like button", () => {
    const blog = {
        title: "blog title",
        author: "blog author",
        url: "blog url",
        likes: 1,
        user: {
            username: "testusername",
            name: "testname"
        }
    }

    const user = {
        username: "differentusername",
        name: "differentname"
    };

    const blogs = [blog];

    render(<MemoryRouter><Blog blogs={blogs} user={user} /></MemoryRouter>)

    const likeButton = screen.getByRole("button", { name: "like" });
    const deleteButton = screen.queryByRole("button", { name: "remove" });

    expect(likeButton).toBeDefined();
    expect(deleteButton).toBeNull();
})

test("The blog’s creator is also shown the delete button", () => {
    const blog = {
        title: "blog title",
        author: "blog author",
        url: "blog url",
        likes: 1,
        user: {
            username: "testusername",
            name: "testname"
        }
    }

    const user = {
        username: "testusername",
        name: "testname"
    };

    const blogs = [blog];

    render(<MemoryRouter><Blog blogs={blogs} user={user} /></MemoryRouter>)

    const likeButton = screen.getByRole("button", { name: "like" });
    const deleteButton = screen.queryByRole("button", { name: "remove" });

    expect(likeButton).toBeDefined();
    expect(deleteButton).toBeDefined();
})

// old tests
// test("renders blog component with title and author, without url and number of likes", () => {
//     const blog = {
//         title: "blog title",
//         author: "blog author",
//         url: "blog url",
//         likes: 1
//     }

//     render(<Blog blog={blog} />)

//     const titleAndAuthor = screen.getByText("blog title blog author", { exact: false })
//     const url = screen.queryByText("blog url");
//     const likes = screen.queryByText("1");

//     expect(titleAndAuthor).toBeDefined();
//     expect(url).toBeNull();
//     expect(likes).toBeNull();
// })

// test("renders all blog details when the view button is pressed", async() => {
//     const blog = {
//         title: "blog title",
//         author: "blog author",
//         url: "blog url",
//         likes: 1,
//         user: {
//             username: "user"
//         }
//     }

//     const userProp = {
//         username: "user"
//     }

//     const mockHandler = vi.fn();

//     render(<Blog blog={blog} user={userProp} />)

//     const user = userEvent.setup();
//     const button = screen.getByText("view");
//     button.addEventListener("click", mockHandler);
//     await user.click(button);

//     const blogTitle = screen.getByText("blog title");
//     const blogAuthor = screen.getByText("blog author");
//     const blogUrl = screen.getByText("blog url");
//     const blogLikes = screen.getByText("likes 1");
//     const hideButton = screen.getByText("hide");
//     const likeButton = screen.getByText("like");
//     const viewButton = screen.queryByText("view");

    
//     expect(blogTitle).toBeDefined();
//     expect(blogAuthor).toBeDefined();
//     expect(blogUrl).toBeDefined();
//     expect(blogLikes).toBeDefined();
//     expect(likeButton).toBeDefined();
//     expect(hideButton).toBeDefined();
//     expect(viewButton).toBeNull();
//     expect(mockHandler.mock.calls).toHaveLength(1);

// })

// test("ensures that if the like button is clicked twice, the like event handler is called twice", async() => {
//     const blog = {
//         title: "blog title",
//         author: "blog author",
//         url: "blog url",
//         likes: 1,
//         user: {
//             username: "user"
//         }
//     }

//     const userProp = {
//         username: "user"
//     }

//     const viewHandler = vi.fn();
//     const likeHandler = vi.fn();
//     const errorHandler = vi.fn();

//     render(<Blog blog={blog} user={userProp} setError={errorHandler} />)

//     const user = userEvent.setup();
//     const button = screen.getByText("view");
//     button.addEventListener("click", viewHandler);
//     await user.click(button);

//     const likeButton = screen.getByText("like");

//     likeButton.addEventListener("click", likeHandler);
//     await user.click(likeButton);
//     await user.click(likeButton);

//     expect(likeHandler.mock.calls).toHaveLength(2);
// })