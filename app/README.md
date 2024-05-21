# 공용 컴포넌트 설명

## `Aside`

실습 문제 풀이 화면에서 옆에 나오는 그것 입니다. Aside nav에 쓰이는 연관 컴포넌트도 함께 들어있습니다.

## `CodeBlank`

**빈칸 채우기** 문제에서 사용하는 컴포넌트. 자세한 렌더링 로직이 궁금하면 `util/codeHole.ts`를 참고

## `CodeBlock`

VSCode에서 사용하는 `monaco` 에디터 라이브러리를 가져다 추상화 한 컴포넌트

## `common`

로직은 같지 않지만 룩앤필을 공유하기 위한 공용 css를 두기 위해서 출발한 폴더지만, 몇몇 유즈케이스도 함께 담게 되었음

## `Header`

페이지 헤더. 서버에서 받은 역할에 따라서 각기 다른것을 렌더링한다.

## `Input`

기본적으로 비제어 컴포넌트지만, drag and drop file input 등을 처리하다 보니, 선택적으로 제어 컴포넌트로도 사용할 수 있는 선택적 prop이 존재하게 되었음

## `Modal`

HTML `dialog`를 래핑하고, backdrop을 적용한 Modal. `<Modal>` 컴포넌트 내에 렌더링 할 요소를 넣으면 된다. backdrop 클릭 시 종료는 요구사항 상 배제되어 있으며, 우측 상단의 x 표시를 눌러야 종료할 수 있다.

## `Radio`

서비스 룩앤필에 맞춘 HTML `<input type="radio">` 이다.

## `Tab`

관리자나 교수가 사용하는 모달 중에는 여러 입력 방법을 지원하는 것들이 있다. 별도의 모달을 만들지 않고, 입력 방법을 선택함. 이를 위한 컴포넌트

## `Table`

css grid layout을 기반으로 표를 렌더링하는 컴포넌트. 크게 `header` 부분과 `data`부분으로 나누어지며, `Map` 형태의 데이터를 넣어주면 동작한다.

### 왜 `Map`을 넣게 했냐?

단순히 배열로 넣으면, 뭐가 뭔지 확인하는데 시간이 많이 걸리고, `object`는 입력한 순서대로 키-값을 접근할 수 있는 보장이 되지 않는다. 그래서 `Map`을 선택함

## `TreeView`

계층 구조를 표시하기 위한 컴포넌트. `SingleSelectTreeview`는 한개만, `MultipleSelectTreeview`는 여러개를 선택할 수 있다.

# 기술스택을 사용한 이유

## Remix

`CRA`가 deprecated 되고... `Next.js`가 사실상의 표준으로 떠올랐다. 만듬새 좋은 프레임워크임은 부정할 수 없다. 그리고 많은 서비스에도 도입이 되고 있고...

SSR, SSG를 통해서 렌더링 속도 향상! 정말 좋은 이야기인데... 그건 prefetching이 가능할 때의 이야기이다... 로그인을 해야지만 사용 가능한 Online judge는 쇼핑몰과 블로그와 다르게 미리 정보를 받아오고, 런타임에 결정될 요소를 fetch 등으로 불러오는 그런 전략을 사용하기 힘들다고 생각한다... 거의 모든 API가 auth를 요구하는데... 그리고 사용자별로 불러와야 할 정보도 일반화를 시키기 힘들고...

Next로도 해결 할 수 있지만, 이미 react-router API에 익숙해진 나에게는 파일 기반 라우팅을 사용하면서 react-router API와 거의 다를것이 없는(같은 회사에서 만들었으니까... 최근에는 인수도 했다더라) Remix는 좋은 선택지였다.

[remix-flat-routes](https://github.com/kiliman/remix-flat-routes)를 이용해서 Next에서 제공하는 [Route Group](https://nextjs.org/docs/app/building-your-application/routing/route-groups)을 모방할 수도 있어서, 딱히 나쁠것 없었다. 매우 굿

## Typescript

난 javascript를 좋아한다. 그치만 가끔은 무엇이든 될 수 있는 이 미친 스펙의 언어를 붙잡아야 할 때가 있다. 어딘가 좀 모자란 친구지만, 그래도 최대한 예상범위 내에서 행동하게끔 안전벨트를 달아주는 해결책들을 여러가지가 나왔지만, 역시 표준은 Typescript 아니겠는가... 후술하는 CSS module과의 integration도 상당히 나쁘지 않은 경험이었다.

## CSS modules

좋은 css in js 모듈들 많다. 근데 굳이 JS에 CSS를 넣어야 할까? 이것 때문에 SSR시 hydration을 하기 전과 후 HTML 생긴것이 달라서 에러가 생기기도 한다. 물론 해결할 방법이 있다는것은 알고 있다만, 조금 더 쉬운 해결책을 생각해봤다.

![css evolution pic](https://miro.medium.com/v2/resize:fit:1200/1*yBxZo9LNEjRaL7eKUBqRSA.png)

이런 그림 많이 봤을 것이다. 근데 꼭 최신 기술, 반짝거리는 기술을 사용해야 좋은걸까? css module은 고전적이고 편안한 방법으로 css를 사용할 수 있다. JS 오브젝트를 어쩌구 하는 추가적인 오버로드 없이, 그놈의 global 함 때문에 이름이 난장판이 되는 css에서 각 `module` 파일마다 이름이 다를것이 보장되는 css module은 상당히 좋은 선택지였다. 그리고, Typescript 확장도 있어서, 해당 css module을 `import` 하면 내가 선언한 css className들을 vscode에서 자동완성 해주게 할 수 있고, TS 경고도 띄워줄 수 있다.
