import LoadingSpinner from "./LoadingSpinner";

export default function Button({ children, loading, onClick }: { children: React.ReactNode, loading: boolean, onClick: () => void }) {
    return (
        <button onClick={onClick} disabled={loading}>
            {loading ? <LoadingSpinner /> : children}
        </button>
    )
}
