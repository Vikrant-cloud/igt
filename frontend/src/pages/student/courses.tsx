import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layouts/Layout';
import { useReactQuery } from '@/utils/useReactQuery';
import { getMyCourses } from '@/api/auth';
import { ContentList } from '@/components/content';
import Pagination from '@/components/Pagination';
import { useState } from 'react';
import { useSearchParams } from 'react-router';

export default function MyCourses() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const limit = 10 ;
  const { data } = useReactQuery(
    ['myCourses', page, limit],
    () => getMyCourses({ queryKey: ['myCourses', page, limit] }),
  );
  const onPageChange = (newPage: number) => {
    setPage(newPage);
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    setSearchParams(params);
  }
  return (
    <Layout>
      <div className="min-h-screen bg-gray-100">
        <h1 className="text-4xl font-bold mb-4">Welcome to the Home Page</h1>
        <p className="text-lg mb-6">Hello, {user?.name || 'Guest'}!</p>
        <p className="text-lg mb-6">You are a {user?.role || 'Guest'}!</p>
        {/* <Chat /> */}
        <ContentList data={data} userRole={user?.role} />
        <Pagination
          total={data?.pagination?.total}
          pageSize={limit}
          currentPage={page}
          onPageChange={onPageChange}
        />
      </div>
    </Layout>
  )
}
