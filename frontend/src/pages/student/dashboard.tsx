import Layout from '@/components/Layouts/Layout';
import { useReactQuery } from '@/utils/useReactQuery';
import { getHomeContentList } from '@/api/auth';
import { ContentList } from '@/components/content';
import Pagination from '@/components/Pagination';
import { useState } from 'react';
import { useSearchParams } from 'react-router';

export default function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const limit = 3;
  const { data } = useReactQuery(
    ['homeContent', page, limit],
    () => getHomeContentList({ queryKey: ['homeContent', page, limit] }),
  );
  const onPageChange = (newPage: number) => {
    setPage(newPage);
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    setSearchParams(params);
  }
  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 mx-5 my-5">
        <h1 className="text-4xl font-bold mb-10">Top Courses</h1>
        {/* <Chat /> */}
        <ContentList data={data} />
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
