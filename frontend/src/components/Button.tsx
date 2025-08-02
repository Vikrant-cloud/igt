import clsx from "clsx";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Button({ name, loading, onClick, type }: { name?: String, loading?: boolean, onClick?: () => void, type?: boolean }) {
    return (
        <button
            type="submit"
            disabled={loading}
            onClick={onClick}
            className={clsx(
                'px-4 bg-red-500 text-white py-3 rounded-full font-semibold tracking-widest transition',
                loading ? 'cursor-not-allowed' : 'cursor-pointer', type ? '' : 'w-full'
            )}
        >
            {loading ? <LoadingSpinner /> : name}
        </button>
    )
}
