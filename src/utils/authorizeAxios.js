import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from '~/utils/formatters'
// Khởi tạo một đối tượng Axios (authorizedAxiosInstance) mục đích để custom và cấu hình chung cho dự án.
let authorizedAxiosInstance = axios.create()

// Thời gian chờ tối đa của 1 reqquest: để 10 phút
authorizedAxiosInstance.defaults.timeout = 1000*60*10

// withCredentials: Sẽ cho phép axios tự động gửi cookie trong mỗi request lên BE (phục vụ việc chúng ta sẽ lưu JWT tokens (refresh & access) vào trong httpOnly Cookie tu back end tra ve)

authorizedAxiosInstance.defaults.withCredentials = true

/**
 * Cấu hình Interceptors (Bộ đánh chặn vào giữa mọi Request & Response)
 * https://axios-http.com/docs/interceptors
 */
// Add a request interceptor: can thiệp vào giữa những cái Request gửi lên cho API
authorizedAxiosInstance.interceptors.request.use( (config) => {
  // Do something before request is sent
  // kỹ thuật chặn spam click
  // xem kỹ mô tả ở file formmater
  interceptorLoadingElements(true)

  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// Add a response interceptor: can thiệp vào giữa những Respone trả về từ API
authorizedAxiosInstance.interceptors.response.use( (response) => {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  interceptorLoadingElements(false)

  return response
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  /* Mọi mã http status code nằm ngoài khoảng 200 - 299 sẽ là error và rơi vào đây */
  // Xử lý tập trung phần hiển thị thông báo lỗi trả về từ mọi API ở đây (viết code một lần: Clean Code)
  interceptorLoadingElements(false)

  let errorMessage = error.errorMessage
  if (error.response?.data?.message) {
    errorMessage = error.response?.data?.message
  }
  // Dùng toastify để hiển thị bất kể mọi mã lỗi lên màn hình - Ngoại trừ mã 410 - GONE phục vụ việc tự động refresh lại token.
  if (error.response?.status !== 410) {
    toast.error(errorMessage)
  }


  return Promise.reject(error)
})


export default authorizedAxiosInstance