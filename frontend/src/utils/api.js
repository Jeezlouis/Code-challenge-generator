import {useAuth} from "@clerk/clerk-react"

export const useApi = () => {
    const {getToken} = useAuth()

    const makeRequest = async (endpoint, options = {}) => {
        const token = await getToken()
        
        // Use environment variable for API base URL
        const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api'
        
        const defaultOptions = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        }

        const response = await fetch(`${baseUrl}/${endpoint}`, {
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