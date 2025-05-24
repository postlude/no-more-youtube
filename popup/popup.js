document.addEventListener('DOMContentLoaded', () => {
	const extensionToggle = document.getElementById('extensionToggle');
	const whitelistInput = document.getElementById('whitelistInput');
	const addWordButton = document.getElementById('addWord');
	const whitelistWords = document.getElementById('whitelistWords');

	const allowedChannelInput = document.getElementById('allowedChannelInput');
	const addChannelButton = document.getElementById('addChannel');
	const allowedChannelsList = document.getElementById('allowedChannels');

	// 익스텐션 상태 로드
	chrome.storage.sync.get(['enabled', 'whitelist', 'allowedChannels'], (result) => {
		extensionToggle.checked = result.enabled ?? true;
		updateWhitelist(result.whitelist ?? []);
		updateAllowedChannels(result.allowedChannels ?? []);
	});

	// 익스텐션 토글 이벤트
	extensionToggle.addEventListener('change', (e) => {
		if (!e.target.checked) {
			const confirmed = window.confirm('Are you sure you want to disable this extension?');
			if (!confirmed) {
				extensionToggle.checked = true;
				return;
			}
		}
		chrome.storage.sync.set({ enabled: e.target.checked }, () => {
			chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
				chrome.tabs.reload(tabs[0].id);
			});
		});
	});

	// 화이트리스트 단어 추가 함수
	function addWhitelistWord() {
		const word = whitelistInput.value.trim();
		if (word) {
			chrome.storage.sync.get(['whitelist'], (result) => {
				const whitelist = result.whitelist ?? [];
				if (!whitelist.includes(word)) {
					whitelist.push(word);
					chrome.storage.sync.set({ whitelist }, () => {
						updateWhitelist(whitelist);
						whitelistInput.value = '';
					});
				}
			});
		}
	}

	// 화이트리스트 단어 추가 버튼 클릭
	addWordButton.addEventListener('click', addWhitelistWord);

	// 화이트리스트 입력창에서 엔터 입력 시 추가
	whitelistInput.addEventListener('keydown', (e) => {
		if (e.key === 'Enter') {
			addWhitelistWord();
		}
	});

	// 화이트리스트 단어 삭제
	whitelistWords.addEventListener('click', (e) => {
		if (e.target.tagName === 'BUTTON') {
			const word = e.target.parentElement.textContent.replace('×', '').trim();
			chrome.storage.sync.get(['whitelist'], (result) => {
				const whitelist = result.whitelist ?? [];
				const newWhitelist = whitelist.filter(w => w !== word);
				chrome.storage.sync.set({ whitelist: newWhitelist }, () => {
					updateWhitelist(newWhitelist);
				});
			});
		}
	});

	// 화이트리스트 UI 업데이트
	function updateWhitelist(words) {
		whitelistWords.innerHTML = words.map(word => `
			<li>
				${word}
				<button>×</button>
			</li>
		`).join('');
	}

	// Allowed Channels 추가 함수
	function addAllowedChannel() {
		const channel = allowedChannelInput.value.trim();
		if (channel) {
			chrome.storage.sync.get(['allowedChannels'], (result) => {
				const allowedChannels = result.allowedChannels ?? [];
				if (!allowedChannels.includes(channel)) {
					allowedChannels.push(channel);
					chrome.storage.sync.set({ allowedChannels }, () => {
						updateAllowedChannels(allowedChannels);
						allowedChannelInput.value = '';
					});
				}
			});
		}
	}

	addChannelButton.addEventListener('click', addAllowedChannel);
	allowedChannelInput.addEventListener('keydown', (e) => {
		if (e.key === 'Enter') {
			addAllowedChannel();
		}
	});

	// Allowed Channels 삭제
	allowedChannelsList.addEventListener('click', (e) => {
		if (e.target.tagName === 'BUTTON') {
			const channel = e.target.parentElement.textContent.replace('×', '').trim();
			chrome.storage.sync.get(['allowedChannels'], (result) => {
				const allowedChannels = result.allowedChannels ?? [];
				const newAllowedChannels = allowedChannels.filter(c => c !== channel);
				chrome.storage.sync.set({ allowedChannels: newAllowedChannels }, () => {
					updateAllowedChannels(newAllowedChannels);
				});
			});
		}
	});

	function updateAllowedChannels(channels) {
		allowedChannelsList.innerHTML = channels.map(channel => `
			<li>
				${channel}
				<button>×</button>
			</li>
		`).join('');
	}
}); 