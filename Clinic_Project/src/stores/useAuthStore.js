import { defineStore } from 'pinia'
import { supabase } from '@/services/DatabaseConnection'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    profile: null,
    loading: false,
    error: null
  }),

  actions: {
    async login(email, password) {
      this.loading = true
      this.error = null
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        if (error) throw error

        this.user = data.user

        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single()

        if (profileError) throw profileError

        this.profile = profile

        localStorage.setItem('user', JSON.stringify(this.user))
        localStorage.setItem('profile', JSON.stringify(profile))

        return null
      } catch (err) {
        //Traduccion de errores
        if (err.message.includes('Invalid login credentials')) {
          this.error = 'Correo o contraseña incorrectos'
        } else {
          this.error = "Ha ocurrido un error al iniciar sesión. Por favor, inténtalo de nuevo más tarde."
        }
        return this.error
      } finally {
        this.loading = false
      }
    },

    async logout() {
      await supabase.auth.signOut()
      this.user = null
      this.profile = null
      localStorage.clear()
    },

    async fetchUser() {
      const { data } = await supabase.auth.getUser()
      this.user = data.user

      if (data.user) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single()
        this.profile = profile
      }
    }
  }
})
