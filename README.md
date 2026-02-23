<h1 align="center">
  <img width="24" height="24" alt="image" src="https://github.com/user-attachments/assets/3997b46a-e806-4c7a-9fb8-48f5263fa03c" />
  네모네모
</h1>

<div>
<p align="center">사이드 프로젝트 팀을 위한 체계적인 일정 관리 앱, 함께 만들고 함께 확인하는 협업 공간.</p> 
</div>

<p align="center">
<img width="600" height="700" alt="1" src="https://github.com/user-attachments/assets/10a49cf0-b1b7-40de-9937-9943f1efa38d" />
<img width="600" height="1000" alt="2" src="https://github.com/user-attachments/assets/16e2256c-333a-4df5-9037-5bec776d5e2d" />
</p>

<br/>

## 프로젝트 소개

#### 📅 팀 중심 일정 관리

- 프로젝트 단위로 팀을 구성하고, 하나의 공간에서 모든 일정을 관리하세요. 개인이 아닌 팀을 기준으로 설계되었습니다.

#### 🗂 포지션별 스케줄 확인

- 역할에 따라 필요한 일정만 선택해 확인할 수 있어 프로젝트 흐름을 더 명확하게 파악할 수 있습니다.

#### ✅ 캘린더와 투두를 한 번에

- 월간 캘린더와 주간 기반 투두로 일정과 할 일을 함께 정리하세요.

<br/>

팀 프로젝트를 더 체계적으로 관리해보세요.

---

## 🛠 기술 스택

### Core

- **React Native**
- **Expo**
- **TypeScript**

### Styling

- **Figma Design Token 기반 전역 스타일**
- **CI/CD를 통한 토큰 자동 반영**

### State Management

- **Context API** (전역 UI/앱 상태)
- **TanStack Query** (서버 상태 관리)

### UI 문서화

- **Storybook** (컴포넌트 단위 UI 상태 문서화)

### Package Manager

- **npm**

---

## 🎨 디자인 토큰 & 전역 스타일

- Figma 디자인 토큰을 **단일 소스**로 사용
- 토큰 가공 후 CI/CD에서 자동 빌드
- 전역 theme으로 등록하여 사용

```
Figma Tokens
 → Token 가공
 → CI/CD
 → styles/theme.ts
```

### 규칙

- 색상, spacing, 폰트 직접 값 사용 금지
- 모든 스타일은 theme 토큰을 통해서만 사용

---

## 📂 폴더 구조

본 프로젝트는 **Atomic Design + Feature-Sliced Design(FSD)** 구조를 사용합니다.

```bash
src/
 ├─ app/
 ├─ features/
 └─ shared/
```

---

### `/shared`

프로젝트 전반에서 재사용되는 공통 자원

- `ui` : Atomic 단위 UI 컴포넌트 (Button, Input 등)
- `story` : 스토리북
- `hooks` : 공통 Custom Hook
- `utils` : 공통 유틸 함수
- `lib` : 공통 라이브러리 로직
- `config` : 설정 및 상수
- `types` : 공통 타입 정의

---

### `/features`

기능 단위 코드 그룹

- UI, API, 상태 관리 로직을 기능별로 응집
- 예) `features/auth`, `features/schedule`, `features/todo`

---

### `/app`

라우팅 및 화면 구성

- 화면 단위 조합
- feature 연결 및 전역 Provider 구성

---

### 구조 원칙 요약

- 공통 요소는 `shared`
- 비즈니스 기능은 `features`
- 화면과 라우팅은 `app`
