import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import '@/index.css'
import App from '@/App.tsx'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { AuthProvider } from '@/context/AuthContext.tsx';
import { ToastContainer } from 'react-toastify';
import Loading from '@/components/Loading.tsx';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Suspense fallback={<Loading />}>
          <App />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </Suspense>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
