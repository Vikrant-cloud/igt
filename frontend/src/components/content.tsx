import type { Content } from "@/pages/courses";
import { useAuth } from "@/hooks/useAuth";
import Course from "./Course/Course";

type ContentList = {
    contents: Content[]
}
export const ContentList = ({
    data,
}: {
    data: ContentList;
}) => {
    const { user } = useAuth();

    return (
        <>
            {data?.contents?.length === 0 ? (
                <p className="text-gray-500">No content added yet.</p>
            ) : (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
                    {data?.contents.map((item: Content) => (
                        <Course item={item} user={user} />
                    ))}
                </div>
            )}
        </>
    );
}