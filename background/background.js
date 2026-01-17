// 숏츠 URL 감지 및 리다이렉트 (항상 차단)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (tab.url && tab.url.startsWith('https://www.youtube.com/shorts')) {
		chrome.tabs.update(tabId, { url: 'https://www.youtube.com/' });
	}
}); 