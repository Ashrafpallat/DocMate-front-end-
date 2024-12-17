import React, { useEffect, useState, useMemo } from 'react';
import DoctorHeader from '../../components/doctor/DoctorHeader';
import { Input, Table, Pagination, message } from 'antd';
import { getDoctorReviews } from '../../services/reviewService';
import { Review } from '../../Interfaces/reviewInterface';

const Reviews: React.FC = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [search, setSearch] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize] = useState<number>(10);

    // Single state for sorting
    const [sortConfig, setSortConfig] = useState<{ columnKey: string; order: 'ascend' | 'descend' | null }>({
        columnKey: '',
        order: null,
    });

    // Fetch reviews from the API
    const fetchReviews = async () => {
        setLoading(true);
        try {
            const data = await getDoctorReviews()
            if (data && data.length > 0) {
                const normalizedReviews = data.map((review: any) => ({
                    ...review,
                    comment: review.review || 'No comment provided',
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
                    review.review.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Apply sorting
        if (sortConfig.columnKey && sortConfig.order) {
            filtered.sort((a, b) => {
                let compareValue = 0;

                if (sortConfig.columnKey === 'name') {
                    compareValue = a.patientId.name.localeCompare(b.patientId.name);
                } else if (sortConfig.columnKey === 'rating') {
                    compareValue = a.rating - b.rating;
                } else if (sortConfig.columnKey === 'createdAt') {
                    compareValue = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                }

                return sortConfig.order === 'ascend' ? compareValue : -compareValue;
            });
        }

        return filtered;
    }, [reviews, search, sortConfig]);

    // Paginate the processed reviews
    const paginatedReviews = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return processedReviews.slice(startIndex, startIndex + pageSize);
    }, [processedReviews, currentPage, pageSize]);

    // Handle sorting
    const handleSort = (columnKey: string) => {
        setSortConfig((prevState) => ({
            columnKey,
            order:
                prevState.columnKey === columnKey && prevState.order === 'ascend'
                    ? 'descend'
                    : 'ascend',
        }));
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
                    onChange={(e) => setSearch(e.target.value)}
                    className="mb-4"
                />

                {/* Reviews Table */}
                <Table
                    columns={[
                        {
                            title: 'Patient Name',
                            dataIndex: ['patientId', 'name'],
                            key: 'name',
                            sorter: true,
                            sortOrder: sortConfig.columnKey === 'name' ? sortConfig.order : null,
                            render: (_: any, record: Review) => record.patientId?.name || 'N/A',
                            onHeaderCell: () => ({ onClick: () => handleSort('name') }),
                        },
                        {
                            title: 'Rating',
                            dataIndex: 'rating',
                            key: 'rating',
                            sorter: true,
                            sortOrder: sortConfig.columnKey === 'rating' ? sortConfig.order : null,
                            render: (rating: number) => (
                              <div>
                                {Array.from({ length: rating }, (_, i) => (
                                  <span key={i} style={{ color: '#FFD700', fontSize: '1.2rem' }}>★</span>
                                ))}
                              </div>
                            ),
                            onHeaderCell: () => ({ onClick: () => handleSort('rating') }),
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
                            sortOrder: sortConfig.columnKey === 'createdAt' ? sortConfig.order : null,
                            render: (date: string) => new Date(date).toLocaleDateString(),
                            onHeaderCell: () => ({ onClick: () => handleSort('createdAt') }),
                        },
                    ]}
                    dataSource={paginatedReviews}
                    loading={loading}
                    pagination={false} // Disable built-in pagination
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
