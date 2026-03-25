import { Effect, Reducer } from 'umi';

export interface StatisticsState {
  appointments: any[];
}

export interface StatisticsModelType {
  namespace: 'statistics';
  state: StatisticsState;
  effects: {
    fetchAppointments: Effect;
  };
  reducers: {
    save: Reducer<StatisticsState>;
  };
}

const StatisticsModel: StatisticsModelType = {
  namespace: 'statistics',
  state: {
    appointments: [],
  },
  effects: {
    *fetchAppointments(_: any, { call, put }: any): Generator<any, any, any> {
      // Giả sử gọi API ở đây
      const response = yield call(() => Promise.resolve([
        { id: 1, service: 'Cắt tóc', price: 100000, date: '2026-03-10' },
        { id: 2, service: 'Spa mặt', price: 500000, date: '2026-03-11' },
      ]));
      yield put({ type: 'save', payload: response });
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, appointments: payload };
    },
  },
};

export default StatisticsModel;