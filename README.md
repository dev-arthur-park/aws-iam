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
생성 후 일정 시간이 지난 AWS Accesskey를 Array 형태로 반환

# /aws/download
생성 후 일정 시간이 지난 AWS Accesskey를 file로 반환

# queryparam
hours -> 생성 후 일정 시간이 지난 키를 찾기 위한 값, 숫자만 허용. 미 입력시 24 * 30 시간(대략 한달)을 기본 값으로 함
```

## Minikube 연결
```bash
1. minkube와 docker 필수 설치
2. Dokerfile를 build
3. Dokerhub에 push
    - push를 하지 않고 로컬에서 진행 할 수 있지만 계속 에러가 발생하거나 환경변수를 바꿔줘야 하므로 docker hub에 올리는 걸 추천
4. docker image 경로를 ./k8s/production.yml의 `image:` 에 추가
5. minikube 실행
    - minikube start
6. pod 생성
    - kubectl apply -f ./k8s/production.yml
7. service 연결
    - kubectl apply -f ./k8s/service.yml
8. service 실행
    - minikube service aws-iam-manage --url
9. 생성된 url를 통해 기능을 확인
10. minikube dashboard 명령어를 실행해서 현재 상태 파악 가능
```
