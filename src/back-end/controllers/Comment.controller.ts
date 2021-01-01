import * as TE from "fp-ts/lib/TaskEither";
import * as D from "io-ts/lib/Decoder";
import { flow, pipe } from "fp-ts/lib/function";
import * as C from "models/Comment";
import * as CS from "back-end/services/Comment.services";
import { makeRequestHandler } from "utils/makeRequestHandler";
import * as RA from "utils/ReqArgs";

export const COMMENT_POST = makeRequestHandler(
  flow(
    RA.decodeAuthHeaders,
    TE.chain(RA.validateJwt),
    TE.chain(RA.decodeParams(D.type({ post_id: D.string }))),
    TE.chain(RA.decodeBody(C.decodeCreateComment)),
    TE.chain(
      RA.authorizeToken(({ body, token }) => [
        body.value.user_id === token.value.sub,
        "Comment.user_id does not match that found in token!"
      ])
    ),
    TE.chain(({ body, params }) =>
      CS.create(body.value.user_id, params.value.post_id, body.value)
    )
  )
);

export const COMMENT_GET = makeRequestHandler(
  flow(
    RA.decodeParams(D.type({ post_id: D.string })),
    TE.chain(({ params }) => CS.getAllByPostId(params.value.post_id))
  )
);

export const COMMENT_DELETE = makeRequestHandler(
  flow(
    RA.decodeAuthHeaders,
    TE.chain(RA.validateJwt),
    TE.chain(RA.decodeParams(D.type({ post_id: D.string, comment_id: D.string }))),
    TE.chain(bhpt =>
      pipe(
        CS.getOneByCommentId(bhpt.params.value.comment_id),
        TE.chain(comment =>
          pipe(
            bhpt,
            RA.authorizeToken(({ token }) => [
              comment.data.user_id === token.value.sub,
              "Comment.user_id does not match that found in token!"
            ])
          )
        )
      )
    ),
    TE.chain(({ body, params }) => CS.deleteById(params.value.comment_id))
  )
);
