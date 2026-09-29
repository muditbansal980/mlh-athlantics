type Review = {
    Id: string;
    CommentedBy: string;
    CommentedById: string;
    CommentedByImage?: string;
    Rating: number;
    Date: string;
    Comment: string;
};
export function CoachReviews({ reviews }: { reviews: Review[] }) {
    return (
        <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-wider font-bold text-neutral-400 mb-2">Client Feedback</h3>

            {reviews.length === 0 ? (
                <p className="text-sm text-neutral-500 italic">No reviews posted yet.</p>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div
                            key={review.Id}
                            className="bg-white border border-neutral-200 p-4 rounded-xl shadow-sm space-y-2"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="text-sm font-bold text-neutral-900">{review.CommentedBy}</h4>
                                    <p className="text-[11px] text-neutral-400">{review.Date}</p>
                                </div>
                                <div className="flex items-center gap-0.5 text-red-600 font-bold text-sm">
                                    {"★".repeat(review.Rating)}
                                    <span className="text-xs text-neutral-400 font-normal ml-1">({review.Rating}.0)</span>
                                </div>
                            </div>
                            <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">
                                "{review.Comment}"
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
