using EduMy.Application.Common;
using EduMy.Application.Services.Courses.DTOs;

namespace EduMy.Application.Services.Courses.Interfaces;

public interface IModuleService
{
    Task<ApiResponse<IEnumerable<ModuleDto>>> GetByCourseIdAsync(int courseId);
    Task<ApiResponse<ModuleDto>> CreateAsync(int courseId, string title, string? description);
    Task<ApiResponse<ModuleDto>> UpdateAsync(int id, string title, string? description);
    Task<ApiResponse> DeleteAsync(int id);
    Task<ApiResponse> ReorderAsync(int courseId, IEnumerable<int> orderedModuleIds);
}
