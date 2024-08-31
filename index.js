const express = require('express');
const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');

const app = express();
const port = 3000;

app.get('/Convert', async (req, res) => {
    const url = req.query.url;

    let driver = await new Builder().forBrowser('chrome').build();

    try {
        await driver.get(url);
        await driver.sleep(3000);

        let chatMessages = [];

        let userMessages = await driver.findElements(By.css('.whitespace-pre-wrap'));
        let gptMessages = await driver.findElements(By.xpath("//div[contains(@class, 'markdown') and contains(@class, 'prose') and contains(@class, 'w-full') and contains(@class, 'break-words') and contains(@class, 'dark:prose-invert') and contains(@class, 'dark')]"));

        console.log(`User messages count: ${userMessages.length}`);
        console.log(`GPT messages count: ${gptMessages.length}`);

        for (let i = 0; i < Math.max(userMessages.length, gptMessages.length); i++) {
            if (i < userMessages.length) {
                let userMessage = await userMessages[i].getText();
                console.log(`User message ${i}: ${userMessage}`);
                chatMessages.push({ sender: 'user', message: userMessage });
            }
            if (i < gptMessages.length) {
                let gptMessage = await gptMessages[i].getText();
                console.log(`GPT message ${i}: ${gptMessage}`);
                chatMessages.push({ sender: 'chatgpt', message: gptMessage });
            }
        }

        res.json(chatMessages);
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
    } finally {
        await driver.quit();
    }
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
