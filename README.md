## Description
AWS Accesskey 중 오래된 키를 가져오는 코드

## Base
```bash
node js
nest
typescript
```

## Pre Condition

```bash
.env file을 본인 환경에 맞는 값으로 변경 함
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## API
```bash
# /aws/list
특정 시간 이전 생성된 AWS Accesskey를 Array 형태로 반환

# /aws/download
특정 시간 이전 생성된 AWS Accesskey를 file로 반환

# queryparam
period -> 시간 단위이며, 숫자만 허용. 미 입력시 24 * 30 시간(대략 한달)을 기본 값으로 함
```
