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

    })

    test("page is rendered", async({ page }) => {
        await page.goto("http://localhost:5173");
        const blogsLink = page.getByRole("link", { name: "blogs" });

        await expect(blogsLink).toBeVisible();
    })

    test("Login succeeds with the correct username/password combination", async({ page }) => {
        await page.goto("http://localhost:5173/login");

        const username = page.getByLabel("username");
        const password = page.getByLabel("password");

        await expect(username).toBeVisible();
        await expect(password).toBeVisible();

        await loginWith(page, "testusername", "testpassword");

        const blogCreateLink = page.getByRole("link", { name: "create new blog" });

        await expect(blogCreateLink).toBeVisible();
    })

    test("Login fails if the username/password is incorrect", async({ page }) => {
        await page.goto("http://localhost:5173/login");

        const username = page.getByLabel("username");
        const password = page.getByLabel("password");

        await expect(username).toBeVisible();
        await expect(password).toBeVisible();

        await loginWith(page, "invalidusername", "invalidpassword");

        await Promise.all([
                page.waitForResponse(res => {
                    return res.url().includes("/api/login") && res.request().method() === "POST";
                })
            ])

        const invalidLogin = page.getByText("invalid username or password");

        expect(invalidLogin).toBeVisible();
    })

    describe("when user is logged in", () => {
        beforeEach(async({ page }) => {
            await page.goto("http://localhost:5173/login");

            const username = page.getByLabel("username");
            const password = page.getByLabel("password");

            await expect(username).toBeVisible();
            await expect(password).toBeVisible();

            await Promise.all([
                page.waitForResponse(res => {
                            return res.url().includes("/api/login") && res.request().method() === "POST";
                    }),
                loginWith(page, "testusername", "testpassword")
            ])
        })

        test("A logged-in user can create a blog", async({ page }) => {
            const createBlogLink = page.getByRole("link", { name: "create new blog"});
            await expect(createBlogLink).toBeVisible();

            await createBlogLink.click();

            await Promise.all([
                createBlog(page, "testtitle", "testauthor", "testurl"),
                page.waitForResponse(res => {
                            return res.url().includes("/api/blogs") && res.request().method() === "POST";
                    })
            ])

            const successMessage = page.getByText("a new blog blog testtitle");
            await expect(successMessage).toBeVisible();
        })

        test("A logged-in user can like blogs", async({ page }) => {
            const createBlogLink = page.getByRole("link", { name: "create new blog"});
            await expect(createBlogLink).toBeVisible();

            await createBlogLink.click();

            await Promise.all([
                createBlog(page, "testtitle", "testauthor", "testurl"),
                page.waitForResponse(res => {
                            return res.url().includes("/api/blogs") && res.request().method() === "POST";
                    })
            ])

            const successMessage = page.getByText("a new blog blog testtitle");
            await expect(successMessage).toBeVisible();

            // liking blog
            const blog = page.getByRole("link", { name: "blog testtitle"})
            await blog.click();

            const likesP = page.getByText("likes");
            const likesText = await likesP.textContent();
            const likesBefore = likesText.split(" ")[0];


            const likeButton = page.getByRole("button", { name: "like" })

            await Promise.all([
                likeButton.click(),
                page.waitForResponse(res => {
                            return res.url().includes("/api/blogs") && res.request().method() === "PUT";
                    })
            ])

            const likesPAfter = page.getByText("likes");
            const likesTextAfter = await likesPAfter.textContent();
            const likesAfter = likesTextAfter.split(" ")[0];
            

            await expect(parseInt(likesAfter)).toBeGreaterThan(parseInt(likesBefore));
        })

        test("A logged-in user can delete a blog", async({ page }) => {
            const createBlogLink = page.getByRole("link", { name: "create new blog"});
            await expect(createBlogLink).toBeVisible();

            await createBlogLink.click();

            await Promise.all([
                createBlog(page, "testtitle", "testauthor", "testurl"),
                page.waitForResponse(res => {
                            return res.url().includes("/api/blogs") && res.request().method() === "POST";
                    })
            ])

            const blog = page.getByRole("link", { name: "blog testtitle"})
            await blog.click();


            const deleteBlogButton = page.getByRole("button", { name: "remove" });
            page.on("dialog", async dialog => {
                await dialog.accept();
            })
            await deleteBlogButton.click();
            await page.waitForResponse(res => {
                            return res.url().includes("/api/blogs") && res.request().method() === "DELETE";
                    })
            

            const deletedBlog = page.getByRole("link", { name: "blog testtitle"});
            await expect(deletedBlog).not.toBeVisible();



        })
    })
    


    // old tests
    // test("Login form is shown", async({ page }) => {
    //     const username = await page.getByLabel("username");
    //     const password = await page.getByLabel("password");

    //     await expect(username).toBeVisible();
    //     await expect(password).toBeVisible();
    // })

    // describe("Login", () => {
    //     test("succeeds with correct credentials", async({ page }) => {
    //         await loginWith(page, "testusername", "testpassword");

    //         await expect(page.getByText("testusername logged in")).toBeVisible();
    //     })

    //     test("fails with wrong credentials", async({ page }) => {
    //         await loginWith(page, "testusername", "wrongpassword");

    //         await expect(page.getByText("testusername logged in")).not.toBeVisible();
    //     })
    // })

    // describe("when logged in", () => {
    //     beforeEach(async({ page }) => {
    //         await loginWith(page, "testusername", "testpassword");
    //     })

    //     test("a new blog can be created", async({ page }) => {
    //         await createBlog(page, "title", "author", "url");

    //         await expect(page.getByText(`blog title blog author`)).toBeVisible();
    //         await expect(page.getByRole("button", { name: "view" })).toBeVisible();
    //     })

    //     test("a blog can be liked", async({ page }) => {
    //         await createBlog(page, "title", "author", "url");

    //         await page.getByRole("button", { name: "view" }).click();
    //         const p = page.getByText("likes");
    //         const pAllText = await p.textContent();
    //         const pSplitted = pAllText.split(" ");
    //         const likesBefore = pSplitted[1];

    //         await page.getByRole("button", { name: "like" }).click();
    //         await page.waitForLoadState('networkidle'); 

    //         const pAfter = page.getByText("likes");
    //         const pAfterAllText = await pAfter.textContent();
    //         const pAfterSplitted = pAfterAllText.split(" ");
    //         const likesAfter = pAfterSplitted[1];
    //         await expect(parseInt(likesAfter)).toBe(parseInt(likesBefore + 1));
    //     })

    //     test("a blog can be deleted", async({ page }) => {
    //         await createBlog(page, "title", "author", "url");
            
    //         page.on("dialog", dialog => {
    //             dialog.accept();
    //         });

    //         await page.getByRole("button", { name: "view" }).click();
    //         await page.getByRole("button", { name: "remove" }).click();
    //         await page.waitForLoadState('networkidle'); 
            
    //         await expect(page.getByText("blog title")).not.toBeVisible();
    //         await expect(page.getByText("blog author")).not.toBeVisible();
    //         await expect(page.getByText("blog url")).not.toBeVisible();
    //         await expect(page.getByText("blog title blog author")).not.toBeVisible();
    //     })
    // })

    // describe("when only the logged in user who created the blog does see the remove blog button", () => {
    //     beforeEach(async({ page, request }) => {
    //         await request.post("http://localhost:3001/api/users", {
    //             data: {
    //                 username: "testusername2",
    //                 name: "testname",
    //                 password: "testpassword2"
    //             }
    //         })
    //     })

    //     test("logged in user who created the blog does see the remove blog button", async({ page }) => {
    //         await loginWith(page, "testusername", "testpassword");
    //         await createBlog(page, "title", "author", "url");

    //         await page.getByRole("button", { name: "view" }).click();
    //         await expect(page.getByRole("button", { name: "remove" })).toBeVisible();
    //     })

    //     test("logged in user who didn't create the blog does not see the remove blog button", async({ page }) => {
    //         await loginWith(page, "testusername", "testpassword");
    //         await createBlog(page, "title", "author", "url");

    //         await page.getByRole("button", { name: "logout" }).click();

    //         await loginWith(page, "testusername2", "testpassword2");
    //         await page.getByRole("button", { name: "view" }).click();
    //         await expect(page.getByRole("button", { name: "remove" })).not.toBeVisible();

    //     })
    // })

    // describe("blog sorting", () => {
    //     beforeEach(async({ page }) => {
    //         await loginWith(page, "testusername", "testpassword");
    //         // create 3 blogs
    //         for(let i = 0; i < 3; i++) {
    //             await createBlog(page, `title${i}`, `author${i}`, `url ${i}`);
    //             await page.waitForLoadState('networkidle');
    //         }
            
    //         // like first blog 2 times, second blog 5 times
    //         for(let i = 0; i < 7; i++) {
    //             const viewButton =  page.getByRole("button", { name: "view" }).nth(i < 2 ? 0 : 1);
    //             await expect(viewButton).toBeVisible();
    //             await viewButton.click();

    //             const likeButton = page.getByRole("button", { name: "like", exact: true });
    //             await expect(likeButton).toBeVisible();

    //             await Promise.all([
    //                 page.waitForResponse(res => {
    //                     return res.url().includes("/api/blogs") && res.request().method() === "PUT";
    //                 }),
    //                 likeButton.click()
    //             ])

    //             const hideButton = page.getByRole("button", { name: "hide" });
    //             await expect(hideButton).toBeVisible();
    //             await hideButton.click();
    //         }


    //         // like third blog 1 time
    //         await page.waitForLoadState('networkidle');
    //         await page.getByRole("button", { name: "view" }).nth(2).click();
    //         await Promise.all([
    //             page.waitForResponse(res => {
    //                 return res.url().includes("/api/blogs") && res.request().method() === "PUT";
    //             }),
    //             page.getByRole("button", { name: "like", exact: true }).click()
    //         ])
    //         await page.getByRole("button", { name: "hide" }).click();
    //     })

    //     test("all blogs are arranged in order according to the most likes", async({ page }) => {
    //         await page.getByRole("button", { name: "sort by likes" }).click();

    //         const blogs = page.locator(".blog");
    //         const blogCount = await blogs.count();
    //         for(let i = 0; i < blogCount; i++) {
    //             if(i < blogCount - 1) {
    //                 const blog = blogs.nth(i);
    //                 const nextBlog = blogs.nth(i + 1);
    //                 // click on view button, get the likes of current i and the next one
    //                 const viewCurrent = blog.getByRole("button", { name: "view" });
                    
    //                 await viewCurrent.click();
    //                 const pCurrent = blog.getByText("likes");
                   
    //                 const pCurrentText = await pCurrent.textContent();
    //                 const pCurrentLikes = parseInt(pCurrentText.split(" ")[1]);
    //                 await blog.getByRole("button", { name: "hide" }).click();
                    
                
    //                 const viewNext = nextBlog.getByRole("button", { name: "view" });

    //                 await viewNext.click();
    //                 const pNext = nextBlog.getByText("likes");

    //                 const pNextText = await pNext.textContent();
    //                 const pNextLikes = parseInt(pNextText.split(" ")[1]);
    //                 await nextBlog.getByRole("button", { name: "hide" }).click();

    //                 await expect(pCurrentLikes).toBeGreaterThan(pNextLikes);
    //             }
    //         }
            
    //     })
    // })
})