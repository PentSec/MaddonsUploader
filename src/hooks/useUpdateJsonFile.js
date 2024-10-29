import axios from 'axios'
import { toast } from 'react-toastify'

const useUpdateJsonFile = (TOKEN_API_JSON) => {
    const updateJsonFile = async (newAddonData) => {
        const jsonRepoFullName = import.meta.env.VITE_JSON_REPO
        const baseUrl = `https://api.github.com/repos/${jsonRepoFullName}`
        const headers = { Authorization: `token ${TOKEN_API_JSON}` }

        try {
            const response = await axios.get(`${baseUrl}/contents/api.json`, { headers })
            const sha = response.data.sha
            const existingContent = JSON.parse(atob(response.data.content))
            const updatedContent = [...existingContent, newAddonData]
            console.log('updatedContent:', updatedContent)
            console.log('newAddonData:', newAddonData.description)
            const encodedContent = btoa(JSON.stringify(updatedContent, null, 2))

            await axios.put(
                `${baseUrl}/contents/api.json`,
                {
                    message: `Updating api.json with ${newAddonData.name} data`,
                    content: encodedContent,
                    sha
                },
                { headers }
            )
        } catch (error) {
            toast.error('error updating api.json: ' + error.message)
            throw error
        }
    }

    return { updateJsonFile }
}

export default useUpdateJsonFile
