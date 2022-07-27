require("chromedriver");
require("geckodriver");

let {By, Builder, Key, until, Capability} = require("selenium-webdriver");
const {password} = require("./store");
const prompt = require("prompt-sync")({ sigint: true });

let browserstack_user = prompt("Enter username: ");
let browserstack_key = prompt("Enter access key: ");
let parallel_status = prompt("Run parallel configurations (yes or no): ");

var capability1 = {
    "os" : "Windows",
    "os_version" : "10",
    "browserName" : "Chrome",
    "browser_version" : "latest",
    "project" : "Bstack Demo test",
    "name" : "Bstack Demo test",
    "browserstack.local" : "false",
    "browserstack.networkLogs" : "true",
    "browserstack.selenium_version" : "4.2.2",
}

const capability2 = [
    {
        "os" : "Windows",
        "os_version" : "10",
        "browserName" : "Firefox",
        "browser_version" : "latest",
        "project" : "Bstack Demo test",
        "name" : "Bstack Demo test",
        "browserstack.local" : "false",
        "browserstack.networkLogs" : "true",
    },
    {
        "os" : "Windows",
        "os_version" : "10",
        "browserName" : "Chrome",
        "browser_version" : "latest",
        "project" : "Bstack Demo test",
        "name" : "Bstack Demo test",
        "browserstack.local" : "false",
        "browserstack.networkLogs" : "true",
        "browserstack.selenium_version" : "4.2.2",
    }
]

async function test(capability) {
    let driver = new Builder().usingServer(`https://${browserstack_user}:${browserstack_key}@hub.browserstack.com/wd/hub`).withCapabilities(capability).build();

    try {
        await driver.get("http://live.browserstack.com/");

        await driver.findElement({id : "user_email_login"}).sendKeys("adarsh.s+demo@browserstack.com");

        await driver.findElement({id : "user_password"}).sendKeys(password);

        await driver.findElement({id : "user_submit"}).click();

        await driver.wait(until.elementsLocated(By.className("dnd__droppable browser-version-list")));

        await driver.findElement(By.xpath('//*[@id="platform-list-react"]/div/div[2]/div/div[2]/div[4]/div[1]/div[1]/div')).click();

        await driver.wait(until.elementLocated(By.id('settings')));

        await driver.findElement(By.id('settings')).click();

        let element = await driver.findElement(By.id("bd-dashboard"));

        let y = (capability.browserName == "Chrome") ? 50 : 10;

        await setTimeout(() => {
            driver.actions().move({origin: element, duration : 100, x : -15, y : y}).click().sendKeys("Browserstack").keyDown(Key.ENTER).perform();
        }, 15000)

    } catch(e) {
        console.log(e.message);
    }

    setTimeout(() => {
        driver.quit();
    }, 60000)
}


if (parallel_status === "no")
    test(capability1);
else {
    capability2.map((capability) => {
        test(capability)
    })
}