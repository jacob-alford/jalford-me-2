import { createStore, applyMiddleware } from "redux";
import { catchError } from "rxjs/operators";
import {
  createEpicMiddleware,
  combineEpics,
  ActionsObservable,
  StateObservable
} from "redux-observable";
import { composeWithDevTools } from "redux-devtools-extension";
import { reducer } from "front-end/features/store";
import * as StoreEpics from "front-end/features/epics";

const epics = [...Object.values(StoreEpics)];

const rootEpic = (
  action$: ActionsObservable<any>,
  store$: StateObservable<any>,
  dependencies: any
) =>
  combineEpics(...epics)(action$, store$, dependencies).pipe(
    catchError((err, source) => {
      console.error(err);
      return source;
    })
  );

const epicMiddleware = createEpicMiddleware();

const store = createStore(reducer, composeWithDevTools(applyMiddleware(epicMiddleware)));

epicMiddleware.run(rootEpic);

export default store;
