import { Effect, Reducer } from 'umi';
import { getDanhSachQuyetDinh } from '@/services/quyetDinh';

export interface QuyetDinhState {
  list: any[];
}

const QuyetDinhModel: any = { 
  namespace: 'quyetDinh',
  state: {
    list: [],
  },
  effects: {
    *fetch({ payload }: any, { call, put }: any): any {
      const response = yield call(getDanhSachQuyetDinh);
      yield put({ type: 'save', payload: response });
    },
  },
  reducers: {
    save(state: any, { payload }: any) {
      return { ...state, list: payload };
    },
  },
};
export default QuyetDinhModel;