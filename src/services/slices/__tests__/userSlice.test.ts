import userReducer, {
  setAuthChecked,
  clearUserErrors,
  setUser,
  setAuthenticated,
  logoutUser,
  getUser,
  registerUser,
  loginUser,
  updateUser
} from '../userSlice';

import type { TUser } from '@utils-types';

type TUserState = {
  user: TUser | null;
  isAuthenticated: boolean;
  isAuthChecked: boolean;
  loginUserRequest: boolean;
  loginUserError: string | null;
  registerUserRequest: boolean;
  registerUserError: string | null;
};

const userInitialState: TUserState = {
  user: null,
  isAuthenticated: false,
  isAuthChecked: false,
  loginUserRequest: false,
  loginUserError: null,
  registerUserRequest: false,
  registerUserError: null
};

describe('userSlice', () => {
  const fakeUser: TUser = {
    name: 'John Doe',
    email: 'john@example.com'
  };

  // Мок для localStorage
  beforeEach(() => {
    const localStorageMock = (() => {
      let store: Record<string, string> = {};
      return {
        getItem: jest.fn((key) => store[key] || null),
        setItem: jest.fn((key, value) => {
          store[key] = value.toString();
        }),
        removeItem: jest.fn((key) => {
          delete store[key];
        }),
        clear: jest.fn(() => {
          store = {};
        })
      };
    })();
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock
    });

    // Мок для document.cookie
    let cookie = '';
    Object.defineProperty(document, 'cookie', {
      configurable: true,
      get: () => cookie,
      set: (val) => {
        cookie = val;
      }
    });
  });

  it('должен возвращать начальное состояние', () => {
    expect(userReducer(undefined, { type: '' })).toEqual(userInitialState);
  });

  it('должен обрабатывать setAuthChecked', () => {
    const nextState = userReducer(userInitialState, setAuthChecked(true));
    expect(nextState.isAuthChecked).toBe(true);
  });

  it('должен обрабатывать clearUserErrors', () => {
    const prevState = {
      ...userInitialState,
      loginUserError: 'ошибка1',
      registerUserError: 'ошибка2'
    };
    const nextState = userReducer(prevState, clearUserErrors());
    expect(nextState.loginUserError).toBeNull();
    expect(nextState.registerUserError).toBeNull();
  });

  it('должен обрабатывать setUser', () => {
    const nextState = userReducer(userInitialState, setUser(fakeUser));
    expect(nextState.user).toEqual(fakeUser);
  });

  it('должен обрабатывать setAuthenticated', () => {
    const nextState = userReducer(userInitialState, setAuthenticated(true));
    expect(nextState.isAuthenticated).toBe(true);
  });

  it('должен обрабатывать logoutUser', () => {
    const prevState = {
      ...userInitialState,
      user: fakeUser,
      isAuthenticated: true,
      isAuthChecked: false
    };

    const nextState = userReducer(prevState, logoutUser());

    expect(nextState.user).toBeNull();
    expect(nextState.isAuthenticated).toBe(false);
    expect(nextState.isAuthChecked).toBe(true);
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('refreshToken');
    expect(document.cookie).toContain('accessToken=; Max-Age=0');
  });

  describe('extraReducers getUser', () => {
    it('должен обрабатывать getUser.fulfilled', () => {
      const action = { type: getUser.fulfilled.type, payload: fakeUser };
      const nextState = userReducer(userInitialState, action);
      expect(nextState.user).toEqual(fakeUser);
      expect(nextState.isAuthenticated).toBe(true);
      expect(nextState.isAuthChecked).toBe(true);
    });

    it('должен обрабатывать getUser.rejected', () => {
      const action = { type: getUser.rejected.type };
      const nextState = userReducer(userInitialState, action);
      expect(nextState.isAuthChecked).toBe(true);
    });
  });

  describe('extraReducers registerUser', () => {
    it('должен обрабатывать registerUser.pending', () => {
      const action = { type: registerUser.pending.type };
      const nextState = userReducer(userInitialState, action);
      expect(nextState.registerUserRequest).toBe(true);
      expect(nextState.registerUserError).toBeNull();
    });

    it('должен обрабатывать registerUser.fulfilled', () => {
      const action = { type: registerUser.fulfilled.type, payload: fakeUser };
      const nextState = userReducer(userInitialState, action);
      expect(nextState.registerUserRequest).toBe(false);
      expect(nextState.user).toEqual(fakeUser);
      expect(nextState.isAuthenticated).toBe(true);
    });

    it('должен обрабатывать registerUser.rejected', () => {
      const action = {
        type: registerUser.rejected.type,
        payload: 'Ошибка регистрации'
      };
      const nextState = userReducer(userInitialState, action);
      expect(nextState.registerUserRequest).toBe(false);
      expect(nextState.registerUserError).toBe('Ошибка регистрации');
    });
  });

  describe('extraReducers loginUser', () => {
    it('должен обрабатывать loginUser.pending', () => {
      const action = { type: loginUser.pending.type };
      const nextState = userReducer(userInitialState, action);
      expect(nextState.loginUserRequest).toBe(true);
      expect(nextState.loginUserError).toBeNull();
    });

    it('должен обрабатывать loginUser.fulfilled', () => {
      const action = { type: loginUser.fulfilled.type, payload: fakeUser };
      const nextState = userReducer(userInitialState, action);
      expect(nextState.loginUserRequest).toBe(false);
      expect(nextState.user).toEqual(fakeUser);
      expect(nextState.isAuthenticated).toBe(true);
    });

    it('должен обрабатывать loginUser.rejected', () => {
      const action = {
        type: loginUser.rejected.type,
        payload: 'Ошибка логина'
      };
      const nextState = userReducer(userInitialState, action);
      expect(nextState.loginUserRequest).toBe(false);
      expect(nextState.loginUserError).toBe('Ошибка логина');
    });
  });

  describe('extraReducers updateUser', () => {
    it('должен обрабатывать updateUser.fulfilled', () => {
      const action = { type: updateUser.fulfilled.type, payload: fakeUser };
      const nextState = userReducer(userInitialState, action);
      expect(nextState.user).toEqual(fakeUser);
    });
  });
});
