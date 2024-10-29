import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const API_URL = import.meta.env.VITE_ORG_URL

const useCreateGitHubRepo = (TOKEN_API) => {
    const [repoUrl, setRepoUrl] = useState('')

    const createRepo = async (repoName) => {
        try {
            const response = await axios.post(
                API_URL,
                { name: repoName, private: false },
                { headers: { Authorization: `token ${TOKEN_API}` } }
            )
            setRepoUrl(response.data.full_name)
            return response.data
        } catch (error) {
            console.error('error creating repository:', error)
            if (error.response) {
                if (error.response.status === 422) {
                    const errors = error.response.data.errors
                    if (Array.isArray(errors)) {
                        const nameErrors = errors.filter((err) => err.field === 'name')
                        if (nameErrors.length > 0) {
                            const messages = nameErrors.map((err) => err.message).join(', ')
                            toast.error(`Addon: ${repoName} - ${messages}`)
                        } else {
                            toast.error('error creating repository or uploading files')
                        }
                    } else {
                        toast.error('error response from API')
                    }
                } else {
                    toast.error('error: ' + error.message)
                }
            } else {
                toast.error('error connecting: ' + error.message)
            }
        }
    }

    const createInitialCommit = async (repoFullName, newAddonData) => {
        try {
            const baseUrl = `https://api.github.com/repos/${repoFullName}`
            const headers = { Authorization: `token ${TOKEN_API}` }
            const readmeContent = `# This addons is part of the [MaddonsManager](https://github.com/PentSec/MaddonsManager) project.
            
## ${newAddonData.name}

![Addon Image](${newAddonData.imageUrl})

**Author**: ${newAddonData.author}

**Description**: ${newAddonData.description}

**Addon Type**: ${newAddonData.addonType || 'N/A'}

**Folders**: ${newAddonData.folders.join(', ')}

**GitHub Repository**: [${newAddonData.githubRepo}](${newAddonData.githubRepo})

**Created at**: ${newAddonData.lastCommitDate}

## This content is automatic uploaded by the [Maddons Uploader](https://github.com/PentSec/MaddonsUploader) project.`

            const content = btoa(readmeContent)
            await axios.put(
                `${baseUrl}/contents/README.md`,
                {
                    message: `Initial commit with README.md for ${newAddonData.name}`,
                    content
                },
                { headers }
            )
        } catch (error) {
            toast.error('Error creating initial commit: ' + error.message)
            throw error
        }
    }

    return { repoUrl, createRepo, createInitialCommit }
}

export default useCreateGitHubRepo
