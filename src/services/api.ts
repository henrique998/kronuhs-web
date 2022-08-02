import axios, { AxiosError } from 'axios'
import { parseCookies, setCookie } from 'nookies'
import { signOut } from '../contexts/AuthContext'

let cookies = parseCookies()
let isRefreshing = false;
let failedRequestsQueue = [];

const { '@kronuhs:token': token } = cookies

export const api = axios.create({
  baseURL: 'http://localhost:3333',
  headers: {
    Authorization: `Bearer ${token}`
  }
})

api.interceptors.response.use(response => {
    return response;
  },
  (error: AxiosError) => {    
    if (error.response?.status === 401) {
      if (error.response.data?.message.code === 'token.expired') {
        cookies = parseCookies();

        const { '@kronuhs:refresh_token': refresh_token } = cookies;
        const originalConfig = error.config;

        if (!isRefreshing) {
          isRefreshing = true;

          api.post('/blog/session/refresh-token', {
            refresh_token
          }).then(response => {          
            const newToken = response.data.token;
  
            setCookie(undefined, '@kronuhs:token', newToken, {
              maxAge: 60 * 60 * 24 * 30,
              path: '/'
            });
  
            setCookie(undefined, '@kronuhs:refresh_token', response.data.refresh_token, {
                maxAge: 60 * 60 * 24 * 30,
                path: '/'
            });
  
            api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

            failedRequestsQueue.forEach(request => request.onSuccess(newToken));
            failedRequestsQueue = [];
          }).catch(err => {
            failedRequestsQueue.forEach(request => request.onFailure(err));
            failedRequestsQueue = [];
          }).finally(() => {
            isRefreshing = false;
          })
        }

        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({
            onSuccess: (token: string) => {
              originalConfig.headers['Authorization'] = `Bearer ${token}`;

              resolve(api(originalConfig));
            },
            onFailure: (err: AxiosError) => {
              reject(err);
            },
          })
        })
      } else {
        signOut();        
      }
    }

    return Promise.reject(error)
  }
)