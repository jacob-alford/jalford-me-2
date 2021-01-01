# jalford-me

This is some sort of dozenth iteration of my website. This time I've put the back-end and front-end in the same repo (scary).

## Features:

- **Heavy** use of fp-ts
- Fully functional wherever possible (exclusion in times where interfacing with imperative code is imperative)
- Back-end technology:
  - express-js (routing)
  - prisma
  - custom declarative header/parameter/body decoding/auth scheme (beautiful) (see below)

## Examples:

### Incredibly declarative / fully typed / functional:

`src / back-end/ controllers / User.controller.ts`

```typescript
export const USER_PUT = makeRequestHandler(
  flow(
    RA.decodeAuthHeaders,
    TE.chain(RA.validateJwt),
    TE.chain(RA.decodeParams(D.type({ user_id: D.string }))),
    TE.chain(RA.decodeBody(U.decodeUpdateUser)),
    TE.chain(
      RA.authorizeToken(({ token, params }) => [
        token.value.user_id === params.value.user_id,
        "user_id found in token does not match that of request!"
      ])
    ),
    TE.chain(({ body, params }) => US.updateById(params.value.user_id, body.value))
  )
);
```
