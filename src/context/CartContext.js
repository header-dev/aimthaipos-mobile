import createDataContext from './createDataContext'

const budgeReducer = (state, action) => {
    switch (action.type) {
        case 'load_badge':
            return { ...state, data: action.payload }
        case 'add_badge':
            return { ...state, data: state.data + 1 }
        case 'del_badge':
            return { ...state, data: state.data - 1 }
        default:
            return state;
    }
}

const loadBudge = dispatch => async () => {
    dispatch({ type: 'load_badge', payload: 1 })
}

const addBudge = dispatch => async () => {
    dispatch({ type: 'add_badge' })
}

const delBudge = dispatch => async () => {
    dispatch({ type: 'del_badge' })
}


export const { Provider, Context } = createDataContext(
    budgeReducer,
    { loadBudge, addBudge, delBudge },
    { data: 0 }
);