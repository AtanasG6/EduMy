using EduMy.Application.Services.Reviews.Interfaces;
using EduMy.Application.Common;
using EduMy.Application.Repositories;
using EduMy.Application.Services.Reviews.DTOs;
using EduMy.Domain.Entities.Enrollments;
using EduMy.Domain.Entities.Reviews;

namespace EduMy.Application.Services.Reviews.Implementations;

public class ReviewService : IReviewService
{
    private readonly IDeletableEntityRepository<Review, int> _reviewRepository;
    private readonly IRepository<Enrollment, int> _enrollmentRepository;

    public ReviewService(
        IDeletableEntityRepository<Review, int> reviewRepository,
        IRepository<Enrollment, int> enrollmentRepository)
    {
        _reviewRepository = reviewRepository;
        _enrollmentRepository = enrollmentRepository;
    }

    public async Task<ApiResponse<IEnumerable<ReviewDto>>> GetByCourseIdAsync(int courseId)
    {
        var reviews = await _reviewRepository.FindAllAsync(r => r.CourseId == courseId);
        return ApiResponse<IEnumerable<ReviewDto>>.Ok(reviews.Select(MapToDto));
    }

    public async Task<ApiResponse<ReviewDto>> CreateAsync(int studentId, CreateReviewRequest request)
    {
        var isEnrolled = await _enrollmentRepository.AnyAsync(
            e => e.StudentId == studentId && e.CourseId == request.CourseId && e.IsCompleted);

        if (!isEnrolled)
            return ApiResponse<ReviewDto>.Fail("You can only review courses you have completed.");

        var alreadyReviewed = await _reviewRepository.AnyAsync(
            r => r.StudentId == studentId && r.CourseId == request.CourseId);

        if (alreadyReviewed)
            return ApiResponse<ReviewDto>.Fail("You have already reviewed this course.");

        var review = new Review
        {
            StudentId = studentId,
            CourseId = request.CourseId,
            Rating = request.Rating,
            Comment = request.Comment,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _reviewRepository.AddAsync(review);
        await _reviewRepository.SaveChangesAsync();

        var created = await _reviewRepository.GetByIdAsync(review.Id, "Student");
        return ApiResponse<ReviewDto>.Ok(MapToDto(created!), "Review submitted.");
    }

    public async Task<ApiResponse> DeleteAsync(int id)
    {
        var review = await _reviewRepository.GetByIdAsync(id);

        if (review is null)
            return ApiResponse.Fail("Review not found.");

        _reviewRepository.SoftDelete(review);
        await _reviewRepository.SaveChangesAsync();

        return ApiResponse.Ok("Review deleted.");
    }

    private static ReviewDto MapToDto(Review review) => new()
    {
        Id = review.Id,
        CourseId = review.CourseId,
        StudentName = $"{review.Student?.FirstName} {review.Student?.LastName}".Trim(),
        Rating = review.Rating,
        Comment = review.Comment,
        CreatedAt = review.CreatedAt
    };
}
