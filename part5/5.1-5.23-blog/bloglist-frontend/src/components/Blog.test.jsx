import { afterEach, test, expect, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

afterEach(() => {
    cleanup();
})

test("renders blog component with title and author, without url and number of likes", () => {
    const blog = {
        title: "blog title",
        author: "blog author",
        url: "blog url",
        likes: 1
    }

    render(<Blog blog={blog} />)

    const titleAndAuthor = screen.getByText("blog title blog author", { exact: false })
    const url = screen.queryByText("blog url");
    const likes = screen.queryByText("1");

    expect(titleAndAuthor).toBeDefined();
    expect(url).toBeNull();
    expect(likes).toBeNull();
})

test("renders all blog details when the view button is pressed", async() => {
    const blog = {
        title: "blog title",
        author: "blog author",
        url: "blog url",
        likes: 1,
        user: {
            username: "user"
        }
    }

    const userProp = {
        username: "user"
    }

    const mockHandler = vi.fn();

    render(<Blog blog={blog} user={userProp} />)

    const user = userEvent.setup();
    const button = screen.getByText("view");
    button.addEventListener("click", mockHandler);
    await user.click(button);

    const blogTitle = screen.getByText("blog title");
    const blogAuthor = screen.getByText("blog author");
    const blogUrl = screen.getByText("blog url");
    const blogLikes = screen.getByText("likes 1");
    const hideButton = screen.getByText("hide");
    const likeButton = screen.getByText("like");
    const viewButton = screen.queryByText("view");

    
    expect(blogTitle).toBeDefined();
    expect(blogAuthor).toBeDefined();
    expect(blogUrl).toBeDefined();
    expect(blogLikes).toBeDefined();
    expect(likeButton).toBeDefined();
    expect(hideButton).toBeDefined();
    expect(viewButton).toBeNull();
    expect(mockHandler.mock.calls).toHaveLength(1);

})

test("ensures that if the like button is clicked twice, the like event handler is called twice", async() => {
    const blog = {
        title: "blog title",
        author: "blog author",
        url: "blog url",
        likes: 1,
        user: {
            username: "user"
        }
    }

    const userProp = {
        username: "user"
    }

    const viewHandler = vi.fn();
    const likeHandler = vi.fn();
    const errorHandler = vi.fn();

    render(<Blog blog={blog} user={userProp} setError={errorHandler} />)

    const user = userEvent.setup();
    const button = screen.getByText("view");
    button.addEventListener("click", viewHandler);
    await user.click(button);

    const likeButton = screen.getByText("like");

    likeButton.addEventListener("click", likeHandler);
    await user.click(likeButton);
    await user.click(likeButton);

    expect(likeHandler.mock.calls).toHaveLength(2);
})