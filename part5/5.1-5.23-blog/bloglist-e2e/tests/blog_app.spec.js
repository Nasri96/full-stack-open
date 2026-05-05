const { test, expect, beforeEach, describe } = require('@playwright/test');
import { createBlog, loginWith } from "./helper";

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
            await loginWith(page, "testusername", "testpassword");

            await expect(page.getByText("testusername logged in")).toBeVisible();
        })

        test("fails with wrong credentials", async({ page }) => {
            await loginWith(page, "testusername", "wrongpassword");

            await expect(page.getByText("testusername logged in")).not.toBeVisible();
        })
    })

    describe("when logged in", () => {
        beforeEach(async({ page }) => {
            await loginWith(page, "testusername", "testpassword");
        })

        test("a new blog can be created", async({ page }) => {
            await createBlog(page, "title", "author", "url");

            await expect(page.getByText(`blog title blog author`)).toBeVisible();
            await expect(page.getByRole("button", { name: "view" })).toBeVisible();
        })

        test("a blog can be liked", async({ page }) => {
            await createBlog(page, "title", "author", "url");

            await page.getByRole("button", { name: "view" }).click();
            const p = await page.getByText("likes");
            const pAllText = await p.textContent();
            const pSplitted = pAllText.split(" ");
            const likesBefore = pSplitted[1];

            await page.getByRole("button", { name: "like" }).click();
            await page.waitForLoadState('networkidle'); 

            const pAfter = await page.getByText("likes");
            const pAfterAllText = await pAfter.textContent();
            const pAfterSplitted = pAfterAllText.split(" ");
            const likesAfter = pAfterSplitted[1];
            await expect(parseInt(likesAfter)).toBe(parseInt(likesBefore + 1));
        })

        test("a blog can be deleted", async({ page }) => {
            await createBlog(page, "title", "author", "url");
            
            page.on("dialog", dialog => {
                dialog.accept();
            });

            await page.getByRole("button", { name: "view" }).click();
            await page.getByRole("button", { name: "remove" }).click();
            await page.waitForLoadState('networkidle'); 
            
            await expect(page.getByText("blog title")).not.toBeVisible();
            await expect(page.getByText("blog author")).not.toBeVisible();
            await expect(page.getByText("blog url")).not.toBeVisible();
            await expect(page.getByText("blog title blog author")).not.toBeVisible();
        })
    })

    describe("when only the logged in user who created the blog does see the remove blog button", () => {
        beforeEach(async({ page, request }) => {
            await request.post("http://localhost:3001/api/users", {
                data: {
                    username: "testusername2",
                    name: "testname",
                    password: "testpassword2"
                }
            })
        })

        test("logged in user who created the blog does see the remove blog button", async({ page }) => {
            await loginWith(page, "testusername", "testpassword");
            await createBlog(page, "title", "author", "url");

            await page.getByRole("button", { name: "view" }).click();
            await expect(page.getByRole("button", { name: "remove" })).toBeVisible();
        })

        test("logged in user who didn't create the blog does not see the remove blog button", async({ page }) => {
            await loginWith(page, "testusername", "testpassword");
            await createBlog(page, "title", "author", "url");

            await page.getByRole("button", { name: "logout" }).click();

            await loginWith(page, "testusername2", "testpassword2");
            await page.getByRole("button", { name: "view" }).click();
            await expect(page.getByRole("button", { name: "remove" })).not.toBeVisible();

        })
    })

    describe("blog sorting", () => {
        beforeEach(async({ page }) => {
            await loginWith(page, "testusername", "testpassword");
            // create 3 blogs
            for(let i = 0; i < 3; i++) {
                await createBlog(page, `title${i}`, `author${i}`, `url ${i}`);
                await page.waitForLoadState('networkidle');
            }
            
            // like first blog 2 times
            for(let i = 0; i < 2; i++) {
                await page.getByRole("button", { name: "view" }).nth(0).click();
                await page.getByRole("button", { name: "like", exact: true }).click();
                
                await page.waitForLoadState('networkidle');
                await page.getByRole("button", { name: "hide" }).click();
            }

            
            // like second blog 5 times(this does not work reliably)
            for(let i = 0; i < 5; i++) {
                await page.getByRole("button", { name: "view" }).nth(1).click();
                await page.getByRole("button", { name: "like", exact: true }).click();
                

                await page.waitForLoadState('networkidle');
                await page.getByRole("button", { name: "hide" }).click();
                
            }

            // like third blog 1 time
            await page.waitForLoadState('networkidle');
            await page.getByRole("button", { name: "view" }).nth(2).click();
            await page.getByRole("button", { name: "like", exact: true }).click();
            await page.getByRole("button", { name: "hide" }).click();
        })

        test("blogs are arranged in order according to the most likes", async({ page }) => {
            await page.getByRole("button", { name: "sort by likes" }).click();

            // blog with most likes
            await expect(page.locator(".blog").nth(0).getByText("blog title1 blog author1")).toBeVisible();

            // blog with least likes
            await expect(page.locator(".blog").nth(2).getByText("blog title2 blog author2")).toBeVisible();
            
        })
    })
})