import { test, expect } from "@playwright/test";
import type {Page, Route} from "@playwright/test";

test.describe("typing tests", ()=>
{test.beforeEach( async ({page})=>
{
    await page.route("https://shortstories-api.onrender.com/", (route)=> route.fulfill ({
        json:{_id:"42", title:"statue of the seven",author: "a", story:"The world opens itself before those with noble hearts",moral:"m"},
        headers: {"access-control-allow-origin":"*"}
    }));
    await page.goto("/");
    await expect(page.locator("#passage span").first()).toHaveClass(/current/);
});
test("whether characters are marked correct/incorrect",async({page})=>{
    await page.locator("#inp").focus();
    await page.keyboard.type("Tje");
    await expect(page.locator("#passage span").nth(0)).toHaveClass("correct");
    await expect(page.locator("#passage span").nth(1)).toHaveClass("wrong");
    await expect(page.locator("#passage span").nth(2)).toHaveClass("correct");
}
);
test("backspace clears the colour grading and moves cursor back", async({page})=>{
    await page.locator("#inp").focus();
    await page.keyboard.type("Thx");
    await expect(page.locator("#passage span").nth(2)).toHaveClass(/wrong/);
    await page.keyboard.press("Backspace");
    await expect(page.locator("#passage span").nth(2)).toHaveClass("current");
    await expect(page.locator("#passage span").nth(2)).not.toHaveClass("wrong");
})})
test.describe("API errors", ()=> { 
const fail= (page:Page,handler:(route:Route)=>void|Promise<void>)=> page.route("https://shortstories-api.onrender.com/",handler);

test("shows message when api returns 500", async({page})=>
{
    await fail (page, (r)=>r.fulfill({
        headers:{"access-control-allow-origin":"*"},
        status: 500,
        body: "oops"
    }));
    await page.goto("/");
    await expect (page.locator("#passage")).toHaveText("Couldn't load a passage. Please reload to try again.");
    await expect(page.locator("#inp")).toBeDisabled();
});
test ("message shown when network fails", async({page})=>{
await fail (page, (r)=>r.abort());
await page.goto("/");
await expect(page.locator("#passage")).toContainText("Couldn't load a passage");
});
test("rejects a response with the wrong shape", async ({ page }) => {
    await fail(page, (r) => r.fulfill({ json: { title: "no story field" }, headers: {"access-control-allow-origin":"*"} }));
    await page.goto("/");
    await expect(page.locator("#passage")).toContainText("Couldn't load a passage");
    await expect(page.locator("#passage span")).toHaveCount(0);
});
});