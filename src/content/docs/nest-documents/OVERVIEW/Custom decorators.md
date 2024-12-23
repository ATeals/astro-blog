---
title: Custom decorators
description: Nest 공식문서 기반 정리
image: https://i.imgur.com/Gp0VLDF.png
date: 2024-06-05T16:17
draft: 
tags:
  - NestJS
  - 공식문서
series: nest-document
slug: custom-decorators
---

> 이 글은 Nest 공식문서를 번역한 글입니다. [원문](https://docs.nestjs.com/custom-decorators)

Nest는 **decorators**라는 언어 기능을 중심으로 구축되었습니다. 데코레이터는 일반적으로 사용되는 많은 프로그래밍 언어에서 잘 알려진 개념이지만 자바스크립트 세계에서는 아직 비교적 생소한 개념입니다. 데코레이터의 작동 방식을 더 잘 이해하려면 [이 글](https://medium.com/google-developers/exploring-es7-decorators-76ecb65fb841)을 읽어보시기 바랍니다. 다음은 간단한 정의입니다.

> ES2016 데코레이터는 함수를 반환하고 대상, 이름 및 속성 설명자를 인수로 받을 수 있는 표현식입니다. 데코레이터 앞에 `@` 문자를 붙이고 데코레이터를 적용하려는 대상의 맨 위에 배치하면 됩니다. 데코레이터는 클래스, 메서드 또는 프로퍼티에 대해 정의할 수 있습니다.

## Param decorators[#](https://docs.nestjs.com/custom-decorators#param-decorators)

Nest는 HTTP 경로 핸들러와 함께 사용할 수 있는 유용한**param decorators** 세트를 제공합니다. 다음은 제공되는 데코레이터와 이들이 나타내는 일반 Express(또는 Fastify) 객체 목록입니다.

|                            |                                      |
| -------------------------- | ------------------------------------ |
| `@Request(), @Req()`       | `req`                                |
| `@Response(), @Res()`      | `res`                                |
| `@Next()`                  | `next`                               |
| `@Session()`               | `req.session`                        |
| `@Param(param?: string)`   | `req.params` / `req.params[param]`   |
| `@Body(param?: string)`    | `req.body` / `req.body[param]`       |
| `@Query(param?: string)`   | `req.query` / `req.query[param]`     |
| `@Headers(param?: string)` | `req.headers` / `req.headers[param]` |
| `@Ip()`                    | `req.ip`                             |
| `@HostParam()`             | `req.hosts`                          |

또한 나만의 사용자 지정 데코레이터를 만들 수도 있습니다. 이것이 왜 유용한가요?

node.js 세계에서는 **request** 객체에 속성을 첨부하는 것이 일반적인 관행입니다. 그런 다음 다음과 같은 코드를 사용하여 각 경로 핸들러에서 프로퍼티를 수동으로 추출합니다.

```typescript
const user = req.user;
```

코드를 더 읽기 쉽고 투명하게 만들기 위해 `@User()` 데코레이터를 만들어 모든 컨트롤러에서 재사용할 수 있습니다.

```typescript title="user.decorator.ts"
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const User = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
```

그런 다음 요구 사항에 맞는 곳에서 간단히 사용할 수 있습니다.

```typescript
@Get()
async findOne(@User() user: UserEntity) {
  console.log(user);
}
```

## Passing data[#](https://docs.nestjs.com/custom-decorators#passing-data)

데코레이터의 동작이 특정 조건에 따라 달라지는 경우 데이터 매개변수를 사용하여 데코레이터의 팩토리 함수에 인수를 전달할 수 있습니다. 이에 대한 한 가지 사용 사례는 키별로 요청 개체에서 속성을 추출하는 사용자 정의 데코레이터입니다. 예를 들어  [authentication layer](https://docs.nestjs.com/techniques/authentication#implementing-passport-strategies)가 요청의 유효성을 검사하고 사용자 엔티티를 요청 개체에 첨부한다고 가정해 보겠습니다. 인증된 요청의 사용자 엔티티는 다음과 같을 수 있습니다.

```json
{
  "id": 101,
  "firstName": "Alan",
  "lastName": "Turing",
  "email": "alan@email.com",
  "roles": ["admin"]
}
```

프로퍼티 이름을 키로 사용하고, 프로퍼티가 존재하면 관련 값을 반환하는 데코레이터를 정의해 보겠습니다(존재하지 않거나 `user` 객체가 생성되지 않은 경우 정의되지 않음).

```typescript title="user.decorator.ts"
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const User = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;

  return data ? user?.[data] : user;
});
```

컨트롤러의 `@User()` 데코레이터를 통해 특정 프로퍼티에 액세스하는 방법은 다음과 같습니다.

```typescript
@Get()
async findOne(@User('firstName') firstName: string) {
  console.log(`Hello ${firstName}`);
}
```

동일한 데코레이터를 다른 키와 함께 사용하여 다른 프로퍼티에 액세스할 수 있습니다. `user` 객체가 깊거나 복잡한 경우 요청 핸들러를 더 쉽고 가독성 있게 구현할 수 있습니다.

> [!NOTE] HINT
> TypeScript 사용자의 경우 `createParamDecorator<T>()`는 제네릭이라는 점에 유의하세요. 즉, `createParamDecorator<string>((data, ctx) => ...)`와 같이 명시적으로 유형 안전을 적용할 수 있습니다. 또는 팩토리 함수에서 매개변수 유형을 지정할 수도 있습니다(예: `createParamDecorator((data: string, ctx) => ...)`. 둘 다 생략하면 데이터 유형은 `any`가 됩니다.

## Working with pipes[#](https://docs.nestjs.com/custom-decorators#working-with-pipes)

Nest는 사용자 정의 매개변수 데코레이터를 기본 제공 매개변수(`@Body()`, `@Param()` 및 `@Query()`)와 동일한 방식으로 처리합니다. 즉, 사용자 정의 주석이 달린 매개변수(예제에서는 `user` 인수)에 대해서도 파이프가 실행됩니다. 또한 사용자 정의 데코레이터에 직접 파이프를 적용할 수도 있습니다.

```typescript
@Get()
async findOne(
  @User(new ValidationPipe({ validateCustomDecorators: true }))
  user: UserEntity,
) {
  console.log(user);
}
```

> [!NOTE] HINT
> `validateCustomDecorators` 옵션은 `true`으로 설정해야 합니다. `ValidationPipe`는 기본적으로 사용자 정의 데코레이터로 주석이 달린 인수의 유효성을 검사하지 않습니다.

## Decorator composition[#](https://docs.nestjs.com/custom-decorators#decorator-composition)

Nest는 여러 데코레이터를 구성하는 헬퍼 메서드를 제공합니다. 예를 들어 인증과 관련된 모든 데코레이터를 하나의 데코레이터로 결합하고 싶다고 가정해 보겠습니다. 다음과 같은 구성으로 이를 수행할 수 있습니다.

```typescript title="auth.decorator.ts"
import { applyDecorators } from "@nestjs/common";

export function Auth(...roles: Role[]) {
  return applyDecorators(
    SetMetadata("roles", roles),
    UseGuards(AuthGuard, RolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: "Unauthorized" })
  );
}
```

그런 다음 이 사용자 정의 `@Auth()` 데코레이터를 다음과 같이 사용할 수 있습니다.

```typescript
@Get('users')
@Auth('admin')
findAllUsers() {}
```

이렇게 하면 한 번의 선언으로 네 가지 데코레이터를 모두 적용하는 효과가 있습니다.

> [!WARNING] WARNING
> `nestjs/swagger` 패키지의 `@ApiHideProperty()` 데코레이터는 컴포저블이 불가능하며 `applyDecorators` 함수와 함께 제대로 작동하지 않습니다.
