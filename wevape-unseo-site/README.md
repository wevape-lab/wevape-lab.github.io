# WEVAPE 인천공항 운서역점 — QR 사이트

## 1. 올리는 법

1. `wevape-lab/wevape-lab.github.io` 저장소를 엽니다
2. **Add file → Upload files**
3. 이 압축을 푼 뒤 **`unseo` 폴더를 통째로** 끌어다 놓습니다
4. 아래 **Commit changes** 를 누릅니다
5. 1~2분 뒤 아래 주소가 열립니다

```
https://wevape-lab.github.io/unseo
```

`qr` 폴더는 인쇄용이라 올리지 않아도 됩니다. 올려도 상관은 없습니다.

---

## 2. 파일 설명

```
unseo/index.html          사이트 본체 (이미지까지 전부 이 파일 안에 있습니다)
qr/qr-unseo-brand.svg     QR · 딥퍼플+마젠타 W  ← 권장
qr/qr-unseo-black.svg     QR · 검정 (어디에나 무난)
qr/qr-unseo-vip.svg       QR · 아이보리+금색 (3% 전용 POP용)
qr/*.png                  같은 QR의 이미지판 (2400px)
```

인쇄는 **SVG** 를 쓰세요. 아무리 키워도 뭉개지지 않습니다.
QR 최소 크기는 **2cm**, 둘레의 흰 여백은 잘라내면 안 됩니다.

세 개 모두 실제로 스캔되는지 확인했습니다.

---

## 3. 내용을 바꾸려면

지금은 내용이 `index.html` 안에 들어 있습니다. 가격이나 맛이 바뀌면 저에게 말씀해 주세요.
직원이 직접 바꾸려면 관리자 화면과 데이터베이스가 필요한데, 그건 다음 단계입니다.

---

## 4. 클릭 측정 (선택)

어느 언어가 눌리는지, KICK 1과 KICK 3 중 무엇이 많은지, 어느 맛을 보는지 기록할 수 있습니다.
**설정하지 않아도 사이트는 그대로 동작합니다.**

### Supabase 준비

1. Supabase 프로젝트에서 SQL Editor 를 열고 아래를 실행합니다

```sql
create table qr_events (
  id bigserial primary key,
  store text,
  type  text,
  value text,
  lang  text,
  created_at timestamptz default now()
);

alter table qr_events enable row level security;

-- 익명 사용자는 기록만 가능, 읽기는 불가
create policy "insert only" on qr_events
  for insert to anon with check (true);
```

2. `unseo/index.html` 을 열고 파일 아래쪽 `var TRACK = {` 부분을 찾습니다
3. 두 줄을 채웁니다

```js
url:   'https://xxxx.supabase.co',   // 프로젝트 URL
key:   'eyJhbGci...',                // anon public key
```

`anon public key` 는 공개되어도 되는 키입니다. 위 정책 때문에 기록만 되고 읽지는 못합니다.

### 쌓이는 데이터

| type | value | 의미 |
|---|---|---|
| `open` | `home` | 사이트 진입 |
| `enter` | `yes` / `no` | 성인 확인 응답 |
| `lang` | `ko` `ja` `zh` `en` `ru` | 언어 선택 |
| `screen` | `kick1` `kick3` `pd-c` … | 화면 이동 |
| `kicktab` | `1` / `3` | 제품 안에서 고른 강도 |
| `color` | `pink` `blue` … | 기기 색상 선택 |

---

## 5. 매장이 늘어나면

`unseo` 폴더를 복사해서 `yeonsu`, `nonhyeon` 처럼 이름만 바꾸고,
그 안 `index.html` 의 `store: 'unseo'` 를 매장 코드로 고치면 됩니다.
매장 정보(영업시간·위치)도 같이 고쳐야 합니다.

예정 경로:
`/unseo` `/geomdan` `/gyesan` `/guwol-rodeo` `/guwol-gil` `/nonhyeon` `/yeonsu` `/sangdong` `/jungdong`

---

## 6. 아직 안 된 것

- 관리자 화면 · 데이터베이스 (지금은 내용이 파일에 들어 있음)
- 번역 원어민 검수 (일 · 중 · 영 · 러 모두 초안)
- 3% 맛 사진 5장이 1% 라인과 같은 파일 (특히 망고아이스에 얼음 없음)
- PA-15 이미지에 다른 맛 이름이 박혀 있음 (샘플)
- 품절 표시 없음
- 니코틴 함량 · 가격 · 할인율 표기 법률 검토
