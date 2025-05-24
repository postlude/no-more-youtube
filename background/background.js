// 숏츠 URL 감지 및 리다이렉트
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (tab.url && tab.url.startsWith('https://www.youtube.com/shorts')) {
		chrome.storage.sync.get(['enabled'], (result) => {
			const enabled = result.enabled !== undefined ? result.enabled : true;
			if (enabled) {
				chrome.tabs.update(tabId, { url: 'https://www.youtube.com/' });
			}
		});
	}
}); 