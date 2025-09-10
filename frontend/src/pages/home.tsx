import { motion } from "framer-motion";
import {
    UsersIcon,
    BookOpenIcon,
    BanknotesIcon,
    UserGroupIcon,
} from "@heroicons/react/24/outline";

import Layout from "@/components/Layouts/Layout";
import { GraphCard } from "@/components/GraphCard";
import { useReactQuery } from "@/utils/useReactQuery";
import { getAdminStats } from "@/api/auth";

const GetIcon = ({ title }: { title: string }) => {

    if (title == "Total Students") {
        return <UsersIcon className="h-7 w-7 text-white" />
    }
    if (title == "Total Teachers") {
        return <UserGroupIcon className="h-7 w-7 text-white" />
    }
    if (title == "Total Courses") {
        return <BookOpenIcon className="h-7 w-7 text-white" />
    }
    if (title == "Total Transactions") {
        return <BanknotesIcon className="h-7 w-7 text-white" />
    }
}

export default function AdminDashboard() {
    const { data } = useReactQuery(['admin-stats', 0, 0], getAdminStats)

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-black p-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                    Admin Dashboard
                </h1>

                {/* Stats Cards */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
                    {data?.stats.map((stat: any, idx: number) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="rounded-2xl shadow-lg bg-white dark:bg-gray-900 p-6 flex items-center gap-4 hover:shadow-xl transition"
                        >
                            <div
                                className={`p-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg`}
                            >
                                <GetIcon title={stat.title} />
                            </div>
                            <div>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">
                                    {stat.title}
                                </p>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {stat.value}
                                </h3>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Charts Section */}
                <div className="grid lg:grid-cols-2 gap-8">
                    <GraphCard title="Student Growth" chartData={data?.chartData} dataKey="students" />
                    <GraphCard title="Teachers Growth" chartData={data?.chartData} dataKey="teachers" />
                    <GraphCard title="Courses Added" chartData={data?.chartData} dataKey="courses" />
                    <GraphCard title="Transactions / Revenue" chartData={data?.chartData} dataKey="revenue" />
                </div>
            </div>
        </Layout>
    );
}
