# 크롬 익스텐션 개발 요구사항

## 1. 프로젝트 개요
- 프로젝트명: no-more-youtube
- 목적: 유튜브 시청 제한

## 2. 주요 기능
- youtube 메인 화면 제어
- youtube 숏츠 화면 제어
- 허용 가능한 제목, 채널 화이트 리스트 기능
- 해당 chrome extension 을 on/off 할 수 있는 기능

## 3. 개발 요구사항
### 3.1 기능별 상세 요구사항
- 크롬으로 youtube(https://www.youtube.com/)에 접속하면 모든 영상을 전부 css로 가리고 클릭도 불가능하게 한다.
- youtube 숏츠(https://www.youtube.com/shorts/) 경로에 해당하는 영상으로 접속할 경우 유튜브 메인(https://www.youtube.com)으로 강제 redirect 시킨다.
- 화이트 리스트에 해당하는 단어를 등록할 수 있으며 해당 단어가 영상 제목에 들어간 경우에는 유튜브 메인에서 볼 수 있도록 허용한다.
- 화이트 리스트 채널을 등록할 수 있으며 해당 채널의 영상은 모두 볼 수 있도록 허용한다.
- 이 chrome extension 을 on/off 할 수 있는 버튼을 제공한다.

### 3.2 UI/UX 요구사항
- 최대한 깔끔하게

## 4. 배포 요구사항
- 최초에는 chrome web store에 등록하지 않고, 직접 크롬에 올려서 사용할 수 있을 정도만 되어도 된다.
- chrome web store 등록할 수 있는 가이드를 제공
