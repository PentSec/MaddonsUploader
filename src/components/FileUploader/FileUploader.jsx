import PropTypes from 'prop-types'

function NextUiContainer({ children }) {
    return (
        <div className="flex items-center justify-between w-full p-2 space-x-4 transition-colors duration-300 border-2 border-[#3e3e3f] hover:border-gray-500 rounded-xl">
            {' '}
            {children}{' '}
        </div>
    )
}

const FileUploader = ({ onFilesSelected }) => {
    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files)
        onFilesSelected(selectedFiles)
    }

    return (
        <div className="flex flex-col items-center justify-center mb-4">
            <h2>Select addon base folder</h2>
            <NextUiContainer>
                {' '}
                <input
                    type="file"
                    webkitdirectory="true"
                    name="image"
                    multiple
                    onChange={handleFileChange}
                    className="block w-full text-sm text-primary file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/95"
                    aria-label="Input files"
                />{' '}
            </NextUiContainer>
        </div>
    )
}

FileUploader.propTypes = {
    onFilesSelected: PropTypes.func.isRequired
}

export default FileUploader
