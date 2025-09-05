import React from 'react';
import { Users, BookOpen, DollarSign } from 'lucide-react';
import Layout from '@/components/Layouts/Layout';
import { useReactQuery } from '@/utils/useReactQuery';
import { getTeacherStats } from '@/api/auth';
import { GraphCard } from '@/components/GraphCard';
import { motion } from 'framer-motion';

const DashboardCard: React.FC<{ title: string; value: number | string; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
  <motion.div
    key={value}
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0 * 0.1 }}
    className="rounded-2xl shadow-lg bg-white dark:bg-gray-900 p-6 flex items-center gap-4 hover:shadow-xl transition"
  >
    <div
      className={`p-4 rounded-2xl bg-gradient-to-r ${color} shadow-lg`}
    >
      {icon}
    </div>
    <div>
      <p className="text-gray-600 dark:text-gray-300 text-sm">
        {title}
      </p>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
        {value}
      </h3>
    </div>
  </motion.div>
);

const TeacherDashboard = () => {
  const { data: teacherData } = useReactQuery(
    ['teacherStats', 1, 1],
    getTeacherStats,
  );

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 p-8 font-sans">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Dashboard Overview</h1>
        {
          teacherData &&
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              <DashboardCard
                title="Total Subscribers"
                value={teacherData[0].totals[0].totalPurchases}
                icon={<Users className="w-6 h-6 text-white" />}
                color="bg-indigo-500"
              />
              <DashboardCard
                title="Total Courses"
                value={teacherData[0].totals[0].totalCourses}
                icon={<BookOpen className="w-6 h-6 text-white" />}
                color="bg-green-500"
              />
              <DashboardCard
                title="Total Earnings"
                value={teacherData[0].totals[0].totalRevenue}
                icon={<DollarSign className="w-6 h-6 text-white" />}
                color="bg-orange-500"
              />
            </div>
            {/* --- Charts Section --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <GraphCard title="Student Growth" chartData={teacherData[0].monthly} dataKey="totalPurchases" />
              <GraphCard title="Courses Added" chartData={teacherData[0].monthly} dataKey="totalCourses" />
              <GraphCard title="Earnings Over Time" chartData={teacherData[0].monthly} dataKey="totalRevenue" />
            </div>
          </>
        }
      </div>
    </Layout >
  );
};

export default TeacherDashboard;
