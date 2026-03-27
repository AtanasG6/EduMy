using EduMy.Application.Common;
using EduMy.Application.Services.Reviews.DTOs;

namespace EduMy.Application.Services.Reviews.Interfaces;

public interface IReviewService
{
    Task<ApiResponse<IEnumerable<ReviewDto>>> GetByCourseIdAsync(int courseId);
    Task<ApiResponse<ReviewDto>> CreateAsync(int studentId, CreateReviewRequest request);
    Task<ApiResponse> DeleteAsync(int id);
}
