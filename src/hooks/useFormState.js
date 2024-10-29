import { useState } from 'react'

const useFormState = () => {
    const [repoName, setRepoName] = useState('')
    const [addonType, setAddonType] = useState('')
    const [description, setDescription] = useState('')
    const [value, setValue] = useState(0)
    const [folderBaseName, setFolderBaseName] = useState('')
    const [files, setFiles] = useState([])
    const [statusMessage, setStatusMessage] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)

    return {
        repoName,
        setRepoName,
        addonType,
        setAddonType,
        description,
        setDescription,
        value,
        setValue,
        folderBaseName,
        setFolderBaseName,
        files,
        setFiles,
        statusMessage,
        setStatusMessage,
        isProcessing,
        setIsProcessing
    }
}

export default useFormState
