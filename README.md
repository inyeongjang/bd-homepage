# 🚪BackDoor 홈페이지 운영 매뉴얼

### 1️⃣ 시스템 구조 요약  

| 영역       | 설명                             |
| -------- | ------------------------------ |
| Backend  | Spring Boot (Fly.io 배포)        |
| Frontend | 정적 HTML / JS (GitHub Pages 배포) |
| CI/CD    | GitHub Actions 자동 배포           |
| 인증       | JWT + BCrypt (환경변수 기반)         |


### 2️⃣ 레포지토리 구조

```
backend/        # API 서버 (Spring Boot)
frontend/       # 정적 페이지 파일
scripts/        # 초기 세팅용 (운영 중에는 거의 사용 안함)
.github/workflows/
```

### 3️⃣ 수정 방법
- 코드 수정 → commit → push → GitHub Actions 성공 확인
- FE : `pages-frontend.yml`
- BE : `fly-backend.yml`

### 4️⃣ 관리자 비밀번호 변경 방법

**⚠️ 비밀번호 원문은 절대 Git에 업로드 금지**
**⚠️ ADMIN_PASSWORD_HASH, JWT_SECRET 모두 Fly secrets로 관리**

1. BCrypt 해시 생성
   ```
   new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder()
    .encode("새 비밀번호");
   ```
2. Fly 환경변수 교체
   ```
   fly secrets set ADMIN_PASSWORD_HASH='생성된_해시값'
   ```
3. 로그인 테스트
   ```
   curl -X POST https://<fly-app>.fly.dev/api/admin/auth/login \
   -H "Content-Type: application/json" \
   -d '{"password":"새 비밀번호"}'
