const createBlog = async(page, title, author, url) => {
    await page.getByLabel("title").fill(`blog ${title}`);
    await page.getByLabel("author").fill(`blog ${author}`);
    await page.getByLabel("url").fill(`blog ${url}`);

    await page.getByRole("button", { name: "create" }).click();
}

const loginWith = async(page, username, password) => {
    await page.getByLabel("username").fill(username);
    await page.getByLabel("password").fill(password);

    await page.getByRole("button", { name: "login" }).click();
}

export { createBlog, loginWith };