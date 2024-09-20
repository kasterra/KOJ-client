# KOJ 3.0 - Client(OLD)

~~본 프로젝트는 경북대학교 소프트웨어 공학 연구실에서 제작된 프로그래밍 실습 과목 채점 시스템의 클라이언트 파트입니다.~~

현재 경북대에서 <https://coding.knu.ac.kr>로 배포되고 있는 코드와는 상이한 부분이 많습니다. 실제 코드는 연구실 레포에서 관리되고 있으며, 본 레포는 현재 서비스중인 KOJ와의 상등성을 일체 보증하지 않습니다.

# 실행 방법

`npm run build`후 `npm run start`로 실행 가능.

# 사용한 기술스택

- Remix
- Typescript
- CSS modules
- react-hot-toast
- prism.js
- exceljs
- jszip & file-saver

# 폴더 구조

`app/API` : API 유틸 함수

`app/assets` : 다양한 곳에 사용되는 애셋(특히 이미지)

`app/contexts` : 여러 컴포넌트에서 전역으로 쓰이는 정보를 저장하는 React Context

`app/css` : 전역 css

`app/routes ` : [remix-flat-routes](https://github.com/kiliman/remix-flat-routes)를 활용한 실제로 라우팅 되는 page 컴포넌트

`app/types` : 대부분 API에서 오는 타입들을 정리해둔 폴더

`app/util` : 여러곳에 쓰여서 코드 중복이 발생하거나, 외부라이브러리에 너무 적극적으로 의존해서 렌더링 로직에 넣기 뭣한 것들

`public` : 전역으로 필요한 폰트, og:image, 빈칸 코드 렌더링 보조를 위한 prism.js, 학생 등록을 위해 필요한 엑셀 파일

# 추가적인 정보

각 코드에 대한 설명이나, 왜 이 기술 스택을 사용했는지에 대한 설명은 `app/README.md`에 적혀 있습니다.
