import {types} from '../types';

const initial_state = {
  apiCount: 0,
};
const actionMap = {
  [types.isIncreanment]: (state, act) => ({
    apiCount: state.apiCount + 1,
  }),
  [types.resetCount]: (state, act) => ({
    apiCount: 0,
  }),
};
export default function (state = initial_state, action) {
  const handler = actionMap[action.type];
  return handler ? handler(state, action) : state;
}
