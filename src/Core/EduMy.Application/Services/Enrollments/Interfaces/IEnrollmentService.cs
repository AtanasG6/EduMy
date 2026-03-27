using EduMy.Application.Common;
using EduMy.Application.Services.Enrollments.DTOs;

namespace EduMy.Application.Services.Enrollments.Interfaces;

public interface IEnrollmentService
{
    Task<ApiResponse<IEnumerable<EnrollmentDto>>> GetByStudentIdAsync(int studentId);
    Task<ApiResponse<EnrollmentDto>> GetByIdAsync(int id);
    Task<ApiResponse<EnrollmentDto>> EnrollAsync(int studentId, int courseId);
    Task<ApiResponse> MarkLectureCompleteAsync(int enrollmentId, int lectureId, int watchTimeSeconds);
    Task<ApiResponse> UpdateProgressAsync(int enrollmentId);
}
