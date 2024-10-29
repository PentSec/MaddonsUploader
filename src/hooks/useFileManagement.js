import { useState } from 'react'

const useFileManagement = () => {
    const [selectedFiles, setSelectedFiles] = useState([])

    const extractFolders = (files) => {
        const baseTocFiles = files.filter(
            (file) => file.name.endsWith('.toc') && file.webkitRelativePath.split('/').length === 2
        )
        const subfolderTocFiles = files.filter(
            (file) => file.name.endsWith('.toc') && file.webkitRelativePath.split('/').length > 2
        )
        if (baseTocFiles.length === 1) {
            const tocName = baseTocFiles[0].name.replace('.toc', '')
            return [tocName]
        }

        if (subfolderTocFiles.length > 1) {
            const folderSet = new Set()
            subfolderTocFiles.forEach((tocFile) => {
                const pathSegments = tocFile.webkitRelativePath.split('/')
                folderSet.add(pathSegments[1])
            })

            const folderArray = Array.from(folderSet)
            setSelectedFiles(folderArray)
            return folderArray
        }

        const folderSet = new Set()
        files.forEach((file) => {
            const pathSegments = file.webkitRelativePath.split('/')
            if (pathSegments.length > 1) {
                folderSet.add(pathSegments[1])
            }
        })

        const folderArray = Array.from(folderSet)
        setSelectedFiles(folderArray)
        return folderArray
    }

    const extractAuthor = async (files) => {
        const tocFile = [...files].find((file) => file.name.endsWith('.toc'))
        if (tocFile) {
            const tocText = await tocFile.text()
            const authorLine = tocText.split('\n').find((line) => line.startsWith('## Author:'))
            return authorLine ? authorLine.split(':')[1].trim() : ''
        }
        return ''
    }

    return { extractFolders, extractAuthor, selectedFiles, setSelectedFiles }
}

export default useFileManagement
