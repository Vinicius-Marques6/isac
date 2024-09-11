const { time, hyperlink } = require('discord.js');
const puppeteer = require('puppeteer-extra');
const { DEFAULT_INTERCEPT_RESOLUTION_PRIORITY } = require('puppeteer');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');

puppeteer.use(
	AdblockerPlugin({
	  // Optionally enable Cooperative Mode for several request interceptors
	  interceptResolutionPriority: DEFAULT_INTERCEPT_RESOLUTION_PRIORITY
	})
);

async function _fetchImageOfTheDay(region) {
	const browser = await puppeteer.launch({ headless: true });
	const page = await browser.newPage();
	await page.goto(`https://bing.gifposter.com/${region}`);
	
	await page.waitForSelector('.fl');

	await page.evaluate(() => {
		document.querySelector('.fl').parentElement.removeAttribute('target');
	})
	
	await Promise.all([
		page.waitForNavigation(),
		page.click('.fl')
	]);

	try {
		await page.waitForSelector('#bing_wallpaper');
		const data = await page.$eval('#bing_wallpaper', img => {return {url: img.src, title: img.alt}});
		await browser.close();
		return { data, pageUrl: page.url() };
	} catch (error) {
		console.error(error);
		await browser.close();
		return null;
	}
}

async function sendImageOfTheDay(channel, region = 'us') {
	const { data, pageUrl} = await _fetchImageOfTheDay(region);

	if (!data && !channel) {
		return;
	}

	// if (Array.isArray(channel)) {
	// 	for (const c of channel) {
	// 		const ch = await c.guild.channels.fetch(c.wallpaper_channel);
	// 		await ch.send({ content: `## ${time(new Date(), 'd')} \n### ${hyperlink(data.title, pageUrl)}`, files: [data.url]});
	// 	}
	// 	return;
	// }
	
	await channel.send({ content: `## ${time(new Date(), 'd')} \n### ${hyperlink(data.title, pageUrl)}`, files: [data.url]});
}

module.exports = sendImageOfTheDay;