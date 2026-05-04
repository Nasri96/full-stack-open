const { test, expect, beforeEach, describe } = require('@playwright/test');

describe("Blog App", () => {
    beforeEach(async({ page, request }) => {
        await request.post("http://localhost:3001/api/reset");
        await request.post("http://localhost:3001/api/users", {
            data: {
                username: "testusername",
                name: "testname",
                password: "testpassword"
            }
        })

        await page.goto("http://localhost:5173");
    })

    test("Login form is shown", async({ page }) => {
        const username = await page.getByLabel("username");
        const password = await page.getByLabel("password");

        await expect(username).toBeVisible();
        await expect(password).toBeVisible();
    })

    describe("Login", () => {
        test("succeeds with correct credentials", async({ page }) => {
            const username = await page.getByLabel("Username:").fill("testusername");
            const password = await page.getByLabel("password").fill("testpassword");

            await page.getByRole("button", { name: "login" }).click();

            await expect(page.getByText("testusername logged in")).toBeVisible();
        })

        test("fails with wrong credentials", async({ page }) => {
            const username = await page.getByLabel("Username:").fill("testusername");
            const password = await page.getByLabel("password").fill("wrongpassword");

            await page.getByRole("button", { name: "login" }).click();

            await expect(page.getByText("testusername logged in")).not.toBeVisible();
        })
    })

    describe("when logged in", () => {
        beforeEach(async({ page }) => {
            const username = await page.getByLabel("username").fill("testusername");
            const password = await page.getByLabel("password").fill("testpassword");

            await page.getByRole("button", { name: "login" }).click();
        })

        test("a new blog can be created", async({ page }) => {
            await page.getByRole("button", { name: "create new blog" }).click();
            
            await page.getByLabel("title").fill("blog title");
            await page.getByLabel("author").fill("blog author");
            await page.getByLabel("url").fill("blog url");

            await page.getByRole("button", { name: "create" }).click();

            await expect(page.getByText("blog title blog author")).toBeVisible();
            await expect(page.getByRole("button", { name: "view" })).toBeVisible();
        })
    })
})