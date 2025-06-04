// 전역 화이트리스트 및 허용 채널 변수
let currentWhitelist = [];
let allowedChannels = [];

// 화이트리스트 단어 확인
function isInWhitelist(title, whitelist) {
	title = title.replace(/\s+/g, ''); // 제목에서 모든 공백 제거
	return whitelist.some(word => {
		const wordNoSpace = word.replace(/\s+/g, '');
		return title.toLowerCase().includes(word.toLowerCase())
			|| title.toLowerCase().includes(wordNoSpace.toLowerCase());
	});
}

// 다양한 title selector를 지원
function getVideoTitle(videoElement) {
	const selectors = [
		'#video-title',
		'#video-title-link',
		'.title',
		'.yt-simple-endpoint.style-scope.yt-formatted-string',
		'.yt-simple-endpoint.style-scope.ytd-grid-video-renderer',
		'.yt-simple-endpoint.style-scope.ytd-video-renderer',
		'.ytp-title-link',
		'.style-scope.ytd-rich-grid-media #video-title',
		'.style-scope.ytd-video-renderer #video-title',
		'.style-scope.ytd-compact-video-renderer #video-title',
		'.style-scope.ytd-playlist-video-renderer #video-title',
		'.style-scope.ytd-reel-item-renderer #video-title',
		'a.shortsLockupViewModeHostEndpoint[aria-label]',
		'a.shortsLockupViewModeHostEndpoint[title]',
	];
	for (const selector of selectors) {
		const el = videoElement.querySelector(selector);
		if (el) {
			if (el.getAttribute('aria-label')) return el.getAttribute('aria-label').trim();
			if (el.getAttribute('title')) return el.getAttribute('title').trim();
			if (el.textContent) return el.textContent.trim();
		}
	}
	return '';
}

// 비디오 요소를 검정색 오버레이로 덮기
function coverVideo(videoElement, shouldCover) {
	let overlay = videoElement.querySelector('.nmy-overlay');
	if (shouldCover) {
		if (!overlay) {
			overlay = document.createElement('div');
			overlay.className = 'nmy-overlay';
			overlay.style.position = 'absolute';
			overlay.style.top = 0;
			overlay.style.left = 0;
			overlay.style.width = '100%';
			overlay.style.height = '100%';
			overlay.style.background = 'black';
			overlay.style.opacity = '0.98';
			overlay.style.zIndex = 1000;
			overlay.style.pointerEvents = 'all';
			videoElement.style.position = 'relative';
			videoElement.appendChild(overlay);
		}
	} else {
		if (overlay) {
			overlay.remove();
		}
	}
}

// 비디오 처리 함수
function processAllVideos(whitelist, allowedChannels) {
	// 플레이리스트 페이지는 예외 처리
	if (window.location.pathname === '/feed/playlists') {
		return;
	}
	const selectors = [
		'ytd-rich-item-renderer',
		'ytd-video-renderer',
		'ytd-grid-video-renderer',
		'ytd-reel-item-renderer',
		'ytd-compact-video-renderer',
		'ytd-playlist-video-renderer',
		'ytd-reel-shelf-renderer ytd-reel-item-renderer'
	];
	const videos = document.querySelectorAll(selectors.join(','));
	const allowAll = isAllowedByCurrentUrl(allowedChannels);
	videos.forEach(video => {
		const title = getVideoTitle(video);
		const shouldCover = allowAll ? false : !isInWhitelist(title, whitelist);
		coverVideo(video, shouldCover);
	});
}

// 메인 로직
async function main() {
	const result = await chrome.storage.sync.get(['enabled', 'whitelist', 'allowedChannels']);
	const enabled = result.enabled !== undefined ? result.enabled : true;
	currentWhitelist = result.whitelist || [];
	allowedChannels = result.allowedChannels || [];

	if (!enabled) return;

	// 최초 전체 처리
	processAllVideos(currentWhitelist, allowedChannels);

	// MutationObserver로 동적 로딩 감시
	const observer = new MutationObserver(() => {
		processAllVideos(currentWhitelist, allowedChannels);
	});
	observer.observe(document.body, {
		childList: true,
		subtree: true
	});

	// storage 변경 감지하여 즉시 반영
	chrome.storage.onChanged.addListener((changes, area) => {
		if (area === 'sync' && (changes.whitelist || changes.allowedChannels || changes.enabled)) {
			chrome.storage.sync.get(['enabled', 'whitelist', 'allowedChannels'], (newResult) => {
				const newEnabled = newResult.enabled !== undefined ? newResult.enabled : true;
				currentWhitelist = newResult.whitelist || [];
				allowedChannels = newResult.allowedChannels || [];
				if (newEnabled) {
					processAllVideos(currentWhitelist, allowedChannels);
				}
			});
		}
	});
}

function isAllowedByCurrentUrl(allowedChannels) {
	const url = window.location.href;
	return allowedChannels.some(allowed => {
		return url.includes(allowed) || url.includes(encodeURIComponent(allowed));
	});
}

main(); 