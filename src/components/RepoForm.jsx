import { useEffect } from 'react'
import {
    Button,
    Link,
    Progress,
    Textarea,
    Card,
    CardFooter,
    Chip,
    Image,
    Tooltip
} from "@heroui/react"
import useCreateGitHubRepo from '../hooks/useCreateGitHubRepo'
import useFormState from '../hooks/useFormState'
import useDeleteGitHubRepo from '../hooks/useDeleteGithubRepo'
import useFileManagement from '../hooks/useFileManagement'
import useUpdateJsonFile from '../hooks/useUpdateJsonFile'
import useUploadFilesToGitHub from '../hooks/useUploadFilesToGitHub'
import CheckTypeList from '../components/CheckTypeList/CheckTypeList'
import FileUploader from './FileUploader/FileUploader'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'react-toastify'

const RepoForm = () => {
    const TOKEN_API = import.meta.env.VITE_GITHUB_TOKEN
    const TOKEN_API_JSON = import.meta.env.VITE_API_JSON_REPO
    const COMMIT_JSON = import.meta.env.VITE_COMMIT_JSON

    const {
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
    } = useFormState()

    const { repoUrl, createRepo, createInitialCommit } = useCreateGitHubRepo(TOKEN_API)
    const { uploadFilesToGitHub } = useUploadFilesToGitHub(TOKEN_API)
    const { updateJsonFile } = useUpdateJsonFile(TOKEN_API_JSON)
    const { extractFolders, extractAuthor, selectedFiles, setSelectedFiles } = useFileManagement()
    const { deleteGitHubRepo } = useDeleteGitHubRepo(TOKEN_API)

    const updateStatusMessage = (progress) => {
        if (progress < 1) return 'Starting...'
        if (progress < 10) return 'Creating Repository...'
        if (progress < 20) return 'Creating Initial Commit...'
        if (progress < 30) return 'Creating Branch...'
        if (progress < 40) return 'Count and select files...'
        if (progress < 49) return 'Uploading files to main branch...'
        if (progress < 50) return 'Creating JSON...'
        if (progress < 60) return 'Creating JSON file...'
        if (progress < 70) return 'Updating JSON...'
        if (progress < 90) return 'Verifying repository...'
        return 'Done!'
    }

    const smoothSetValue = (targetValue) => {
        return new Promise((resolve) => {
            const increment = targetValue > 0 ? 1 : -1
            const interval = setInterval(() => {
                setValue((prev) => {
                    const newValue = prev + increment
                    setStatusMessage(updateStatusMessage(newValue))

                    if (
                        (increment > 0 && newValue >= targetValue) ||
                        (increment < 0 && newValue <= targetValue)
                    ) {
                        clearInterval(interval)
                        resolve()
                        return targetValue // Establece el valor final sin que se reinicie
                    }
                    return newValue
                })
            }, 50)
        })
    }

    const handleFilesSelected = (selectedFiles) => {
        setFiles(selectedFiles)
        setDescription('')
        setAddonType('')
        setIsProcessing(false)
    }

    const handleSubmit = async (e) => {
        setIsProcessing(true)
        e.preventDefault()
        console.log(`handleSubmit: ${isProcessing}`)
        const nameToUse = folderBaseName
        const folders = extractFolders(files)
        const tocAuthor = await extractAuthor(files)
        try {
            await smoothSetValue(10)
            const repoData = await createRepo(nameToUse)
            await smoothSetValue(20)
            const apiJson = {
                id: uuidv4(),
                name: nameToUse,
                folders,
                githubRepo: `https://github.com/${repoData.full_name}`,
                imageUrl: `https://github.com/${repoData.full_name}/blob/main/${nameToUse}.png?raw=true`,
                addonType,
                author: tocAuthor,
                description,
                lastCommitDate: new Date().toISOString().split('T')[0],
                hot: ''
            }
            await smoothSetValue(30)
            console.log('Repo created:', repoData.full_name)
            await createInitialCommit(repoData.full_name, apiJson)
            await smoothSetValue(40)
            await uploadFilesToGitHub(repoData.full_name, files)
            await smoothSetValue(50)
            await smoothSetValue(60)
            await updateJsonFile(apiJson)
            await smoothSetValue(80)
            await smoothSetValue(100)
        } catch (error) {
            console.error('Error creating repository:', error)
            setValue(1)
            setStatusMessage('An error occurred. try again.')
            setIsProcessing(false)
            return
        }
    }

    const handleDeleteRepo = async () => {
        if (repoUrl) {
            const result = await deleteGitHubRepo(repoUrl)
            result === true
                ? toast.success(`Repository ${repoUrl} deleted.`)
                : toast.error(result.message)
            setValue(0)
        }
    }

    useEffect(() => {
        if (files.length > 0) {
            const relativeTest = files[0].webkitRelativePath.split('/')
            const folderName = relativeTest[0]
            console.log('folderName:', folderName)
            setFolderBaseName(folderName)
            setRepoName(folderName)
            setSelectedFiles(extractFolders(files))
        }
    }, [files])

    return (
        <section>
            <FileUploader onFilesSelected={handleFilesSelected} />
            <div className="flex flex-col items-center justify-center "></div>
            <form onSubmit={handleSubmit}>
                <Card shadow="lg" isFooterBlurred radius="lg" className="w-auto border-none">
                    <Image
                        src="/bg.jpg"
                        alt="Woman listing to music"
                        className=""
                        height={500}
                        width={500}
                    />

                    <CardFooter className="flex flex-col before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 before:rounded-xl rounded-large bottom-0 w-[calc(100%_-_0px)] shadow-small z-10 absolute h-full">
                        <Tooltip
                            color="secondary"
                            placement="right"
                            content="Search addons description on CurseForge"
                        >
                            {folderBaseName.length > 0 && (
                                <Chip
                                    as={Link}
                                    onClick={() =>
                                        window.open(
                                            `https://www.curseforge.com/wow/search?page=1&pageSize=20&sortBy=relevancy&search=${folderBaseName}`,
                                            'Popup',
                                            'toolbar=no, location=no, statusbar=no, menubar=no, scrollbars=1, resizable=0, width=580, height=600, top=30'
                                        )
                                    }
                                    size="lg"
                                    color="warning"
                                    variant="shadow"
                                    className="cursor-pointer"
                                >
                                    {folderBaseName}
                                </Chip>
                            )}
                        </Tooltip>
                        <CheckTypeList addonType={addonType} setAddonType={setAddonType} />

                        <div className="flex flex-col items-center justify-center w-full h-screen gap-1 p-1">
                            <Textarea
                                maxRows={3}
                                variant="bordered"
                                size="md"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                label="Description"
                                aria-label="Folders selected"
                                color="primary"
                            />
                            <Textarea
                                variant="bordered"
                                size="md"
                                color="primary"
                                value={selectedFiles.join('\n') || folderBaseName}
                                label="Folders"
                                isReadOnly
                                aria-label="Folders selected"
                            />
                        </div>
                        <div className="flex items-center justify-center">
                            <Button
                                aria-label="Create repository and upload addon"
                                type="submit"
                                size="lg"
                                color="primary"
                            >
                                Send
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
                <div className="flex flex-col items-center justify-center">
                    {value > 0 && (
                        <Progress
                            label={statusMessage}
                            showValueLabel={true}
                            value={value}
                            className="mt-1 transition-all duration-500 ease-in-out"
                            color={value < 40 ? 'warning' : value < 70 ? 'success' : 'primary'}
                        />
                    )}

                    {value >= 100 && (
                        <>
                            <Link href={`https://github.com/${repoUrl}`} isExternal showAnchorIcon>
                                View Repository
                            </Link>
                            <Link href={COMMIT_JSON} isExternal showAnchorIcon>
                                View API
                            </Link>
                            <Button
                                aria-label="Delete repository"
                                color="danger"
                                type="button"
                                onClick={handleDeleteRepo}
                                className="mt-2"
                            >
                                Delete {folderBaseName} 🥲
                            </Button>
                        </>
                    )}
                </div>
            </form>
            <footer className="flex flex-col items-center justify-center w-full h-fit">
                <div className="mt-8 text-center">
                    <Link
                        isExternal
                        className="flex items-center gap-1 text-current"
                        href="https://github.com/PentSec/MaddonsUploader"
                        title="Maddons repository"
                    >
                        <p>
                            If you think this app is useful for you, please give it a star on
                            GitHub! 🌟
                        </p>
                    </Link>
                </div>
                <div className="flex items-center justify-between w-full gap-2 p-4 px-4 py-3">
                    <Link
                        isExternal
                        className="flex items-center gap-1 text-current"
                        href="https://maddonsmanager.github.io/"
                        title="Maddons webpage"
                    >
                        <span className="text-tiny">© 2024 All rights reserved. Designed by</span>
                        <p className="text-primary">PentSec</p>
                    </Link>
                    <Link
                        isExternal
                        className="flex items-center gap-1 text-current"
                        href="https://nextui.org/"
                        title="nextui.org homepage"
                    >
                        <span className="text-tiny">using</span>
                        <p className="text-primary">NextUI</p>
                    </Link>
                </div>
            </footer>
        </section>
    )
}

export default RepoForm
