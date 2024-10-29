// hooks/useDeleteGitHubRepo.js
import axios from 'axios'

const useDeleteGitHubRepo = (token) => {
    const deleteGitHubRepo = async (repoFullName) => {
        try {
            const headers = { Authorization: `token ${token}` }
            await axios.delete(`https://api.github.com/repos/${repoFullName}`, { headers })
            return true
        } catch (error) {
            console.error('ERROR deleting repository:', error)
            if (error.response && error.response.status === 404) {
                return {
                    success: false,
                    message: `Repository ${repoFullName} not found. error: ${error.response.data.message}`
                }
            } else {
                return { success: false, message: 'Error deleting repository.' }
            }
        }
    }

    return { deleteGitHubRepo }
}

export default useDeleteGitHubRepo
