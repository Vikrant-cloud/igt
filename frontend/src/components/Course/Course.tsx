import type { Content } from "@/pages/courses";
import { Link } from "react-router";
import { Star, StarHalf, Users } from "lucide-react";
import type { User } from "@/context/AuthContext";
import api from "@/utils/axios";
import Button from "../Button";
import { useState } from "react";

const Course = ({ item, user }: { item: Content, user: User | null }) => {
    const [buttonLoading, setButtonLoading] = useState(false);

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const handleBuy = async (id: string) => {
        setButtonLoading(true)
        try {
            const res = await api.post('/subscription/create-checkout-session', {
                courseId: id
            });
            window.location.href = res.data.url;
        } catch (error) {
            setButtonLoading(false)
        } finally {
            setButtonLoading(false)
        }

    };

    return (
        <div key={item._id} className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl">
            <Link to={`/${user?.role}/course/${item._id}`} style={{ backgroundColor: getRandomColor() }} className="w-full h-40 flex items-center justify-center p-4 text-center relative">
                <h4 className="text-white text-xl font-bold [text-shadow:_0_2px_4px_rgb(0_0_0_/_50%)]">{item.title}</h4>
                {!item.isApproved && (
                    <span className="absolute top-3 right-3 bg-yellow-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                        Pending Approval
                    </span>
                )}
            </Link>
            <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{item.subject}</span>
                    <div className="flex items-center text-yellow-400">
                        {Array(Math.floor(4.6)).fill(0).map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                        {4.6 % 1 > 0 && <StarHalf className="w-4 h-4 fill-current" />}
                        <span className="ml-1 text-gray-500 text-sm">({4.6.toFixed(1)})</span>
                    </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1 truncate">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-2">by {item.createdBy.name}</p>
                {
                    user?.role === 'student' && !item.purchasedBy.includes(user._id) ? (
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                            <div>
                                <span className="text-2xl font-bold text-green-600">${item?.price}</span>
                                <div className="flex items-center text-gray-500 text-sm mt-1">
                                    <Users className="w-4 h-4 mr-1" />
                                    {item?.purchasedBy.length}
                                </div>
                            </div>
                            <Button name="Buy Now" loading={buttonLoading} onClick={() => handleBuy(item._id)} />
                        </div>

                    ) :
                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                            <span className="text-2xl font-bold text-green-600">${item.price}</span>
                            <div className="flex items-center text-gray-500 text-sm">
                                <Users className="w-4 h-4 mr-1" />
                                {item?.purchasedBy.length}
                            </div>
                        </div>
                }
            </div>
        </div>
    )
}

export default Course