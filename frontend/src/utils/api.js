import {useAuth} from "@clerk/clerk-react"

export const useApi = () => {
    const {getToken} = useAuth()

    const makeRequest = async (endpoint, options = {}) => {
        const token = await getToken()
        
        // Check for config from Choreo first, fallback to Vite env vars for local dev
        const baseUrl = window.config?.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL || '/api'
        
        const defaultOptions = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        }

        // Clean up the URL construction to avoid double slashes
        const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
        const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
        const fullUrl = `${cleanBaseUrl}/${cleanEndpoint}`

        const response = await fetch(fullUrl, {
            ...defaultOptions,
            ...options,
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => null)
            if (response.status === 429) {
                throw new Error("Daily quota exceeded")
            }
            throw new Error(errorData?.detail || "An error occurred")
        }

        return response.json()
    }

    return {makeRequest}
}