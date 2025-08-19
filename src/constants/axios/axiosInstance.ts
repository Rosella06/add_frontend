import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import store from '../../redux/store/index'

class AxiosService {
  private static instance: AxiosService
  private axiosInstance: AxiosInstance

  private constructor () {
    const BASE_URL = import.meta.env.VITE_APP_API

    this.axiosInstance = axios.create({
      baseURL: BASE_URL,
      headers: { 'Content-Type': 'application/json' }
    })

    this.initializeInterceptors()
  }

  public static getInstance (): AxiosService {
    if (!AxiosService.instance) {
      AxiosService.instance = new AxiosService()
    }
    return AxiosService.instance
  }

  public getAxiosInstance (): AxiosInstance {
    return this.axiosInstance
  }

  private initializeInterceptors () {
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const state = store.getState()
        const token = state.utils.cookieDecode?.token

        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }

        return config
      },
      error => Promise.reject(error)
    )

    this.axiosInstance.interceptors.response.use(
      response => response,
      error => {
        return Promise.reject(error)
      }
    )
  }
}

export const axiosService = AxiosService.getInstance()
export const axiosInstance = axiosService.getAxiosInstance()
export default axiosInstance
