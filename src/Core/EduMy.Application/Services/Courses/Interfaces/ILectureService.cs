using EduMy.Application.Common;
using EduMy.Application.Services.Courses.DTOs;

namespace EduMy.Application.Services.Courses.Interfaces;

public interface ILectureService
{
    Task<ApiResponse<LectureDto>> GetByIdAsync(int id);
    Task<ApiResponse<LectureDto>> CreateAsync(int moduleId, LectureDto dto);
    Task<ApiResponse<LectureDto>> UpdateAsync(int id, LectureDto dto);
    Task<ApiResponse> DeleteAsync(int id);
    Task<ApiResponse> ReorderAsync(int moduleId, IEnumerable<int> orderedLectureIds);
}
