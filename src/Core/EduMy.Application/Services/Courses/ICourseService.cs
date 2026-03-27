using EduMy.Application.Common;
using EduMy.Application.Services.Courses.DTOs;

namespace EduMy.Application.Services.Courses;

public interface ICourseService
{
    Task<ApiResponse<PagedResult<CourseDto>>> GetAllAsync(CourseFilterRequest filter);
    Task<ApiResponse<CourseDto>> GetByIdAsync(int id);
    Task<ApiResponse<CourseDto>> CreateAsync(int lecturerId, CreateCourseRequest request);
    Task<ApiResponse<CourseDto>> UpdateAsync(int id, UpdateCourseRequest request);
    Task<ApiResponse> DeleteAsync(int id);
    Task<ApiResponse> PublishAsync(int id);
    Task<ApiResponse> ArchiveAsync(int id);
}
