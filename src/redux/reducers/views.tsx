// A reducer is a function that receives the current state and an action object, 
// decides how to update the state if necessary, and returns the new state: (state, action) => newState.
// You can think of a reducer as an event listener which handles events based on the received action (event) type.
import {View} from './reducer'

const initialState = {ctyp:'ETH', view:0}

export default function (state:View = initialState, action: { type: string, payload: View }) {
  switch (action.type) {
    case 'SET_VIEW': {
      return action.payload;
    }
    default:
      return state;
  }
}
