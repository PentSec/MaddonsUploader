// hooks/useUploadFilesToGitHub.js
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const useUploadFilesToGitHub = (TOKEN_API) => {
    const [uploadProgress, setUploadProgress] = useState(0)

    const uploadFilesToGitHub = async (repoFullName, files) => {
        const baseUrl = `https://api.github.com/repos/${repoFullName}`
        const headers = { Authorization: `token ${TOKEN_API}` }
        setUploadProgress(0)
        try {
            let {
                data: {
                    object: { sha: shaLatestCommit }
                }
            } = await axios.get(`${baseUrl}/git/ref/heads/main`, { headers })

            let {
                data: {
                    tree: { sha: shaBaseTree }
                }
            } = await axios.get(`${baseUrl}/git/commits/${shaLatestCommit}`, { headers })
            setUploadProgress(25)
            const batchSize = 99
            for (let i = 0; i < files.length; i += batchSize) {
                const fileBatch = files.slice(i, i + batchSize)

                const tree = await Promise.all(
                    fileBatch.map(async (file) => ({
                        path: file.webkitRelativePath.split('/').slice(1).join('/'),
                        mode: '100644',
                        type: 'blob',
                        content: await readFileAsBase64(file)
                    }))
                )

                const { data: treeResponse } = await axios.post(
                    `${baseUrl}/git/trees`,
                    {
                        base_tree: shaBaseTree,
                        tree
                    },
                    { headers }
                )
                setUploadProgress(50 + ((i + batchSize) / files.length) * 50)
                const commitMessage = `Commit batch with ${i + batchSize} files`
                const { data: commit } = await axios.post(
                    `${baseUrl}/git/commits`,
                    {
                        message: commitMessage,
                        tree: treeResponse.sha,
                        parents: [shaLatestCommit]
                    },
                    { headers }
                )

                shaLatestCommit = commit.sha
                shaBaseTree = commit.tree.sha
            }

            await axios.patch(
                `${baseUrl}/git/refs/heads/main`,
                { sha: shaLatestCommit },
                { headers }
            )
        } catch (error) {
            toast.error('Error uploading Files to GitHub: ' + error.message)
            throw error
        }
    }

    return { uploadFilesToGitHub, uploadProgress }
}

const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result.split(',')[1])
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
}

export default useUploadFilesToGitHub
