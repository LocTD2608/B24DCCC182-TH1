import { Effect, Reducer } from 'umi';
import { getTasks, TaskItem } from '@/services/task';

export interface TaskModelState {
  taskList: TaskItem[];
  myTasks: TaskItem[];
}

export interface TaskModelType {
  namespace: 'task';
  state: TaskModelState;
  effects: {
    fetchTasks: Effect;
    filterMyTasks: Effect;
  };
  reducers: {
    save: Reducer<TaskModelState>;
  };
}

const TaskModel: TaskModelType = {
  namespace: 'task',

  state: {
    taskList: [],
    myTasks: [],
  },

  effects: {
   
    *fetchTasks(_, { call, put }) {
      const response: TaskItem[] = yield call(getTasks);
      yield put({
        type: 'save',
        payload: { taskList: response || [] },
      });
     
      yield put({ type: 'filterMyTasks' });
    },

    *filterMyTasks(_, { select, put }) {
   
      const allTasks: TaskItem[] = yield select((state: any) => state.task.taskList);
      const currentUser = localStorage.getItem('username');
      
      const filtered = (allTasks || []).filter(
        (task: TaskItem) => task.assignedTo === currentUser
      );
      
      yield put({
        type: 'save',
        payload: { myTasks: filtered },
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};

export default TaskModel;