import counterReducer, {
  CounterState,
  incrementByAmount,
} from './siaSlice';

describe('counter reducer', () => {
  const initialState: CounterState = {
    value: 3,
  };
  it('should handle initial state', () => {
    expect(counterReducer(undefined, { type: 'unknown' })).toEqual({
      value: 0,
    });
  });

  it('should handle incrementByAmount', () => {
    const actual = counterReducer(initialState, incrementByAmount(2));
    expect(actual.value).toEqual(5);
  });
});
