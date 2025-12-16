네모네모 앱의 **프론트엔드 저장소**입니다

---

## 🛠 기술 스택

### Core

- **React Native**
- **TypeScript**
- **Expo**

### Styling

- **styled-components**
- **Figma Design Token 기반 전역 스타일**
- CI/CD를 통한 토큰 자동 반영

### State Management

- **Context API** (전역 UI/앱 상태)
- **React Query** (서버 상태 관리)

### UI 문서화

- **Storybook**
  - 컴포넌트 단위 UI 상태 문서화

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

---

## 📚 Storybook

- 문서화 대상
  - atoms
  - molecules
  - organisms
- templates 제외
- 상태별 스토리 필수 제공

목적:

- UI 변경 영향도 확인
- 컴포넌트 사용 기준 명확화

---

## 🌐 상태 관리 규칙

### 서버 상태

- React Query 사용
- Screen 단에서만 호출
- mutation 후 invalidate 필수

### 전역 상태

- Context API 사용
- 인증, 선택된 그룹 등 앱 공통 상태 관리

---

## 📂 API 레이어 구조

```bash
services/
 ├─ auth.ts
 ├─ team.ts
 ├─ schedule.ts
 └─ todo.ts
```

- API 호출 로직만 포함
- UI 로직과 분리

---

## 🔀 브랜치 전략

- `main` : 배포 브랜치
- `develop` : 개발 통합 브랜치
- `feat/*` : 기능 단위 작업 브랜치

---

## 🧾 Commit 컨벤션

| 타입     | 설명        |
| -------- | ----------- |
| feat     | 기능 추가   |
| fix      | 버그 수정   |
| refactor | 리팩토링    |
| style    | 스타일 수정 |
| docs     | 문서        |
| chore    | 설정        |
| design   | 디자인 변경 |

예시:

```
feat: 팀 투두 생성 로직 추가
design: spacing 토큰 수정
```
