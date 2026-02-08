/**
 * API Integration Module
 * Handles all communication with the backend running on localhost:8000
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || '/api'

const hasWindow = typeof window !== 'undefined'
const safeStorage = {
  getItem(key: string) {
    return hasWindow ? window.localStorage.getItem(key) : null
  },
  setItem(key: string, value: string) {
    if (hasWindow) {
      window.localStorage.setItem(key, value)
    }
  },
  removeItem(key: string) {
    if (hasWindow) {
      window.localStorage.removeItem(key)
    }
  },
}

function normalizeToken(token: string | null | undefined): string | null {
  if (!token) return null
  const trimmed = token.trim()
  if (!trimmed || trimmed === 'undefined' || trimmed === 'null') {
    return null
  }
  return trimmed
}

// Helper function for making authenticated requests
async function apiCall(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = normalizeToken(safeStorage.getItem('token'))
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) {
    headers['Authorization'] = token
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `API error: ${response.status}`)
    }

    return response
  } catch (error) {
    throw error
  }
}

/**
 * Authentication APIs
 */
export const authAPI = {
  async register(data: { name: string; email: string; password: string }) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Registration failed')
    }
    return response.json()
  },

  async login(data: { email: string; password: string }) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Login failed')
    }
    return response.json()
  },

  logout() {
    safeStorage.removeItem('token')
    safeStorage.removeItem('userId')
  },
}

/**
 * NEO Feed APIs
 */
export const feedAPI = {
  async getAll() {
    const response = await apiCall('/feed')
    const data = await response.json()

    // Normalize backend shapes:
    // - Some backends return { near_earth_objects: [...] }
    // - Others return an array of simplified objects
    let items: any[] = []

    if (Array.isArray(data)) {
      items = data
    } else if (data && Array.isArray(data.near_earth_objects)) {
      items = data.near_earth_objects
    }

    // Map simplified backend fields to frontend expected NEO schema
    const normalized = items.map(item => ({
      id: item.id || item.neoId || String(item.id),
      name: item.name || item.full_name || item.designation || 'Unknown',
      estimatedDiameter: {
        kilometers: {
          estimated_diameter_min: item.estimated_diameter_min || item.diameter_km || 0,
          estimated_diameter_max: item.estimated_diameter_max || item.diameter_km || item.estimated_diameter || 0,
        },
      },
      close_approach_data: [
        {
          miss_distance: {
            kilometers: item.miss_distance_km || item.close_approach_km || (item.miss_distance && item.miss_distance.kilometers) || '0',
          },
          relative_velocity: {
            kilometers_per_second: item.velocity_kms || (item.relative_velocity && item.relative_velocity.kilometers_per_second) || '0',
          },
        },
      ],
      is_potentially_hazardous_asteroid: item.hazardous === true || item.is_potentially_hazardous_asteroid === true || item.hazardous === 'true' || false,
      // keep raw fields for debugging/advanced uses
      __raw: item,
    }))

    return { near_earth_objects: normalized }
  },

  async getById(neoId: string) {
    const response = await apiCall(`/feed/${neoId}`)
    const data = await response.json()

    // If backend returns array or object, find matching id
    const items = Array.isArray(data) ? data : data?.near_earth_objects || []
    const found = items.find((i: any) => String(i.id) === String(neoId) || String(i.neoId) === String(neoId))

    if (!found) return null

    const normalized = {
      id: found.id || found.neoId || String(found.id),
      name: found.name || found.full_name || 'Unknown',
      estimatedDiameter: {
        kilometers: {
          estimated_diameter_min: found.estimated_diameter_min || found.diameter_km || 0,
          estimated_diameter_max: found.estimated_diameter_max || found.diameter_km || found.estimated_diameter || 0,
        },
      },
      close_approach_data: [
        {
          miss_distance: { kilometers: found.miss_distance_km || '0' },
          relative_velocity: { kilometers_per_second: found.velocity_kms || '0' },
        },
      ],
      is_potentially_hazardous_asteroid: found.hazardous === true || found.is_potentially_hazardous_asteroid === true || false,
      __raw: found,
    }

    return normalized
  },
}

/**
 * Alerts/Watchlist APIs
 */
export const alertsAPI = {
  async getWatchlist(): Promise<string[]> {
    const response = await apiCall('/alerts/watchlist')
    const data = await response.json()

    if (Array.isArray(data)) {
      return data
        .map(item =>
          typeof item === 'string' || typeof item === 'number'
            ? String(item)
            : String(item?.neoId || item?.asteroidId || item?.id || '')
        )
        .filter(id => id.length > 0)
    }

    const list =
      data?.watchlist ||
      data?.watched ||
      data?.ids ||
      data?.neoIds ||
      []

    return Array.isArray(list)
      ? list
          .map((item: any) =>
            typeof item === 'string' || typeof item === 'number'
              ? String(item)
              : String(item?.neoId || item?.asteroidId || item?.id || '')
          )
          .filter((id: string) => id.length > 0)
      : []
  },
  async addToWatchlist(
    neoId: string,
    alertDistanceKm = 20000000,
    alertDaysBefore = 7
  ) {
    const response = await apiCall('/alerts/watch', {
      method: 'POST',
      body: JSON.stringify({ neoId, alertDistanceKm, alertDaysBefore }),
    })
    return response.json()
  },

  async removeFromWatchlist(neoId: string) {
    const response = await apiCall(`/alerts/unwatch/${neoId}`, {
      method: 'POST',
    })
    return response.json()
  },

  async getNotifications() {
    const response = await apiCall('/alerts/notifications')
    return response.json()
  },

  async markNotificationRead(notificationId: string) {
    const response = await apiCall(`/alerts/notifications/${notificationId}/read`, {
      method: 'POST',
    })
    return response.json()
  },
}

/**
 * Community chat APIs
 */
export const chatAPI = {
  async getChannels() {
    const response = await apiCall('/chat/channels')
    return response.json()
  },

  async getMessages(params: { neoId?: string | null; limit?: number } = {}) {
    const searchParams = new URLSearchParams()
    if (params.neoId) {
      searchParams.set('neoId', params.neoId)
    }
    if (params.limit) {
      searchParams.set('limit', String(params.limit))
    }

    const query = searchParams.toString()
    const response = await apiCall(`/chat/messages${query ? `?${query}` : ''}`)
    return response.json()
  },

  async sendMessage(data: { message: string; neoId?: string | null }) {
    const response = await apiCall('/chat/messages', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return response.json()
  },
}

/**
 * Data transformation helpers
 */
export const dataHelpers = {
  /**
   * Calculate hazard level based on asteroid properties
   */
  getHazardLevel(asteroid: {
    is_potentially_hazardous_asteroid: boolean
    estimatedDiameter?: {
      kilometers?: {
        estimated_diameter_max?: number
      }
    }
    close_approach_data?: Array<{
      miss_distance?: {
        kilometers?: string
      }
    }>
  }): 'low' | 'medium' | 'high' {
    if (!asteroid.close_approach_data || asteroid.close_approach_data.length === 0) {
      return 'low'
    }

    const distance = asteroid.close_approach_data[0].miss_distance?.kilometers
      ? parseFloat(asteroid.close_approach_data[0].miss_distance.kilometers)
      : Infinity
    const diameter = asteroid.estimatedDiameter?.kilometers?.estimated_diameter_max || 0

    if (asteroid.is_potentially_hazardous_asteroid && distance < 20000000) {
      return 'high'
    }
    if (distance < 50000000 && diameter > 100) {
      return 'medium'
    }
    return 'low'
  },

  /**
   * Format distance in kilometers to millions of kilometers
   */
  formatDistance(kilometers: string | number): string {
    const km = typeof kilometers === 'string' ? parseFloat(kilometers) : kilometers
    const millions = km / 1000000
    return `${millions.toFixed(2)} M km`
  },

  /**
   * Format velocity from km/s
   */
  formatVelocity(kms: string | number): string {
    const kmh = typeof kms === 'string' ? parseFloat(kms) * 3600 : kms * 3600
    return `${(kmh / 3600).toFixed(2)} km/s`
  },

  /**
   * Format diameter in kilometers
   */
  formatDiameter(km: number): string {
    return `${km.toFixed(2)} km`
  },

  /**
   * Parse close approach date
   */
  parseApproachDate(dateString: string): Date {
    return new Date(dateString)
  },

  /**
   * Get next closest approach
   */
  getNextCloseApproach(
    closeApproachData: Array<{ close_approach_date: string }>
  ): { close_approach_date: string } | null {
    if (!closeApproachData || closeApproachData.length === 0) {
      return null
    }
    return closeApproachData[0]
  },
}

/**
 * Local storage helpers for persistent data
 */
export const storageHelpers = {
  setToken(token: string) {
    const normalized = normalizeToken(token)
    if (normalized) {
      safeStorage.setItem('token', normalized)
    } else {
      safeStorage.removeItem('token')
    }
  },

  getToken(): string | null {
    return normalizeToken(safeStorage.getItem('token'))
  },

  setUserId(userId: string) {
    safeStorage.setItem('userId', userId)
  },

  getUserId(): string | null {
    return safeStorage.getItem('userId')
  },

  clearAuth() {
    safeStorage.removeItem('token')
    safeStorage.removeItem('userId')
  },

  isAuthenticated(): boolean {
    return !!this.getToken()
  },
}

/**
 * Validation helpers
 */
export const validationHelpers = {
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  isValidPassword(password: string): boolean {
    return password.length >= 6
  },

  isValidName(name: string): boolean {
    return name.trim().length > 0
  },

  validateRegistration(data: {
    name: string
    email: string
    password: string
    confirmPassword: string
  }): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!this.isValidName(data.name)) {
      errors.push('Name is required')
    }

    if (!this.isValidEmail(data.email)) {
      errors.push('Valid email is required')
    }

    if (!this.isValidPassword(data.password)) {
      errors.push('Password must be at least 6 characters')
    }

    if (data.password !== data.confirmPassword) {
      errors.push('Passwords do not match')
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  },
}
