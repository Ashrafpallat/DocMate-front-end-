import React, { useEffect, useState, useMemo } from 'react';
import DoctorHeader from '../../components/doctor/DoctorHeader';
import { Input, Table, Pagination, message } from 'antd';
import api from '../../services/axiosInstance';

interface Patient {
    name: string;
    email: string;
    age: number;
    gender: string;
    location: string;
}

interface Review {
    _id: string;
    patientId: Patient;
    rating: number;
    comment: string;
    createdAt: string;
}

const Reviews: React.FC = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [search, setSearch] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize] = useState<number>(10);
    const [sortOrder, setSortOrder] = useState<'ascend' | 'descend' | null>('descend');
    const [ratingSortOrder, setRatingSortOrder] = useState<'ascend' | 'descend' | null>(null); // For rating sorting

    // Fetch reviews from the API
    const fetchReviews = async () => {
        setLoading(true);
        try {
            const response = await api.get('/doctor/reviews');
            const data = response.data;
            if (data && data.length > 0) {
                const normalizedReviews = data.map((review: any) => ({
                    ...review,
                    comment: review.review || 'No comment provided', // Map `review` to `comment`
                }));
                setReviews(normalizedReviews);
            } else {
                message.info('No reviews available');
                setReviews([]);
            }
        } catch (error) {
            message.error('Failed to fetch reviews. Please try again later.');
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch reviews on mount
    useEffect(() => {
        fetchReviews();
    }, []);

    // Filtered and sorted reviews using useMemo
    const processedReviews = useMemo(() => {
        let filtered = [...reviews];

        // Apply search filter
        if (search) {
            filtered = filtered.filter(
                (review) =>
                    review.patientId.name.toLowerCase().includes(search.toLowerCase()) ||
                    review.comment.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Apply sort by date
        if (sortOrder) {
            filtered.sort((a, b) => {
                return sortOrder === 'ascend'
                    ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                    : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
        }

        // Apply sort by rating
        if (ratingSortOrder) {
            filtered.sort((a, b) => {
                return ratingSortOrder === 'ascend' ? a.rating - b.rating : b.rating - a.rating;
            });
        }

        return filtered;
    }, [reviews, search, sortOrder, ratingSortOrder]);

    // Paginate the processed reviews
    const paginatedReviews = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return processedReviews.slice(startIndex, startIndex + pageSize);
    }, [processedReviews, currentPage, pageSize]);

    // Handle search input
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setCurrentPage(1); // Reset to the first page
    };

    // Handle table sort (Date)
    const handleTableSort = (_pagination: any, _filters: any, sorter: any) => {
        setSortOrder(sorter.order || null);
    };

    // Handle Rating sort
    const handleRatingSort = (_pagination: any, _filters: any, sorter: any) => {
        setRatingSortOrder(sorter.order || null);
    };

    return (
        <div className="bg-[#FAF9F6] min-h-screen">
            <DoctorHeader />
            <div className="pt-28 px-8">
                <h2 className="text-2xl font-semibold mb-4">Reviews</h2>

                {/* Search Input */}
                <Input
                    placeholder="Search by patient name or comment"
                    value={search}
                    onChange={handleSearch}
                    className="mb-4"
                />

                {/* Reviews Table */}
                <Table
                    columns={[
                        {
                            title: 'Patient Name',
                            dataIndex: ['patientId', 'name'],
                            key: 'patientName',
                            render: (_: any, record: Review) => record.patientId?.name || 'N/A',
                        },
                        {
                            title: 'Rating',
                            dataIndex: 'rating',
                            key: 'rating',
                            sorter: true,
                            sortOrder: ratingSortOrder,
                            render: (rating: number) => `${rating} ★`,
                            onHeaderCell: () => ({
                                onClick: () => handleRatingSort({}, {}, { order: ratingSortOrder === 'ascend' ? 'descend' : 'ascend' }),
                            }),
                        },
                        {
                            title: 'Comment',
                            dataIndex: 'comment',
                            key: 'comment',
                        },
                        {
                            title: 'Date',
                            dataIndex: 'createdAt',
                            key: 'createdAt',
                            sorter: true,
                            sortOrder: sortOrder,
                            render: (date: string) => new Date(date).toLocaleDateString(),
                            onHeaderCell: () => ({
                                onClick: () => handleTableSort({}, {}, { order: sortOrder === 'ascend' ? 'descend' : 'ascend' }),
                            }),
                        },
                    ]}
                    dataSource={paginatedReviews}
                    loading={loading}
                    pagination={false} // Disable built-in pagination
                    onChange={handleTableSort}
                    rowKey={(record: Review) => record._id}
                    className="bg-white rounded-md shadow-md"
                />

                {/* Pagination */}
                <div className="flex justify-center mt-4">
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={processedReviews.length}
                        onChange={(page) => setCurrentPage(page)}
                        className="text-center"
                    />
                </div>

            </div>
        </div>
    );
};

export default Reviews;
