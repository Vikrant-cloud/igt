import { useAuth } from "@/hooks/useAuth";

const PendingApproval = () => {
    const { logout } = useAuth()

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
            <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
                <div className="flex justify-center mb-4">
                    <div className="h-12 w-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                </div>
                <h1 className="text-2xl font-semibold text-gray-800 mb-2">Pending Approval</h1>
                <p className="text-gray-600">
                    Your account is currently under review. You’ll be notified once approved by the admin.
                </p>
                <div className="mt-6">
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Refresh
                    </button>
                    <button
                        onClick={() => logout()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PendingApproval;
