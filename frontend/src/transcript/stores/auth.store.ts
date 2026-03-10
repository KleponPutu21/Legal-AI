import { defineStore } from "pinia"
import { ref, computed } from "vue"
import { useRouter } from "vue-router"
// import api from "@/lib/api" // kalau sudah punya axios instance

interface User {
  id: number
  email: string
  name?: string
}

export const useAuthStore = defineStore("auth", () => {
  const router = useRouter()

  // ===================== STATE =====================
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)

  // ===================== GETTERS =====================
  const isAuthenticated = computed(() => !!user.value && !!token.value)

  // ===================== ACTIONS =====================

  /**
   * Dipanggil sekali di router.beforeEach
   * buat restore auth dari localStorage
   */
  const initializeAuth = async () => {
    const storedToken = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")

    if (storedToken && storedUser) {
      token.value = storedToken
      user.value = JSON.parse(storedUser)

      // optional: validasi token ke backend
      // try {
      //   const me = await api.get("/auth/me")
      //   user.value = me.data
      // } catch (err) {
      //   logout()
      // }
    }
  }

  /**
   * LOGIN
   */
  const login = async (payload: { email: string; password: string }) => {
    loading.value = true
    try {
      // contoh response backend
      // const res = await api.post("/auth/login", payload)

      const res = {
        token: "dummy-token",
        user: {
          id: 1,
          email: payload.email,
          name: "User Test",
        },
      }

      token.value = res.token
      user.value = res.user

      localStorage.setItem("token", res.token)
      localStorage.setItem("user", JSON.stringify(res.user))

      router.push({ name: "dashboard" })
    } finally {
      loading.value = false
    }
  }

  /**
   * SIGNUP
   */
  const signup = async (payload: {
    email: string
    password: string
  }) => {
    loading.value = true
    try {
      // await api.post("/auth/signup", payload)
      router.push({ name: "verify-otp" })
    } finally {
      loading.value = false
    }
  }

  /**
   * VERIFY OTP
   */
  const verifyOtp = async () => {
    loading.value = true
    try {
      // const res = await api.post("/auth/verify-otp", payload)
      // token.value = res.token
      // user.value = res.user

      router.push({ name: "dashboard" })
    } finally {
      loading.value = false
    }
  }

  /**
   * LOGOUT
   */
  const logout = () => {
    user.value = null
    token.value = null

    localStorage.removeItem("token")
    localStorage.removeItem("user")

    router.push({ name: "login" })
  }

  return {
    // state
    user,
    token,
    loading,

    // getters
    isAuthenticated,

    // actions
    initializeAuth,
    login,
    signup,
    verifyOtp,
    logout,
  }
})
