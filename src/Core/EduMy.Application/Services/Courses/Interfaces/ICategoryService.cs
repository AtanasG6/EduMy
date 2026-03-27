using EduMy.Application.Common;
using EduMy.Application.Services.Courses.DTOs;

namespace EduMy.Application.Services.Courses.Interfaces;

public interface ICategoryService
{
    Task<ApiResponse<IEnumerable<CategoryDto>>> GetAllAsync();
    Task<ApiResponse<CategoryDto>> GetByIdAsync(int id);
    Task<ApiResponse<CategoryDto>> CreateAsync(string name, string? description, int? parentCategoryId);
    Task<ApiResponse<CategoryDto>> UpdateAsync(int id, string name, string? description);
    Task<ApiResponse> DeleteAsync(int id);
}
