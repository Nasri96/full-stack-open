import { afterEach, test, expect, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";

afterEach(() => {
    cleanup();
})


test("when the form is submitted with default inputs", async() => {

    const createBlog = vi.fn();

    render(<BlogForm createBlog={createBlog} />)

    const user = userEvent.setup();
    const submitButton = screen.getByText("create");
    await user.click(submitButton);

    expect(createBlog.mock.calls).toHaveLength(1);
    expect(createBlog).toHaveBeenCalledWith({ title: "", author: "", url: "" });


})