import { NextUIProvider } from '@nextui-org/react'
import RepoForm from './components/RepoForm'
import ErrorBoundary from './components/ErrorBoundary'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
    return (
        <NextUIProvider>
            <ErrorBoundary>
                <ToastContainer
                    position="top-center"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark"
                />
                <main className="flex items-center justify-center h-auto dark text-foreground">
                    <div className="h-full center-gradient"></div>
                    <div className="h-full mt-4 mb-2 text-center rounded-lg shadow-lg bg-gray-900/80">
                        <section className="container h-full content">
                            <h1 className="text-3xl font-bold ">Maddons Uploader</h1>
                            <RepoForm />
                        </section>
                    </div>
                </main>
            </ErrorBoundary>
        </NextUIProvider>
    )
}

export default App
