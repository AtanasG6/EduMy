using EduMy.Application.Services.Courses.Interfaces;
using EduMy.Application.Common;
using EduMy.Application.Repositories;
using EduMy.Application.Services.Courses.DTOs;
using EduMy.Domain.Entities.Courses;

namespace EduMy.Application.Services.Courses.Implementations;

public class CategoryService : ICategoryService
{
    private readonly IDeletableEntityRepository<Category, int> _categoryRepository;

    public CategoryService(IDeletableEntityRepository<Category, int> categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public async Task<ApiResponse<IEnumerable<CategoryDto>>> GetAllAsync()
    {
        var categories = await _categoryRepository.FindAllAsync(c => c.ParentCategoryId == null);
        return ApiResponse<IEnumerable<CategoryDto>>.Ok(categories.Select(MapToDto));
    }

    public async Task<ApiResponse<CategoryDto>> GetByIdAsync(int id)
    {
        var category = await _categoryRepository.GetByIdAsync(id);

        if (category is null)
            return ApiResponse<CategoryDto>.Fail("Category not found.");

        return ApiResponse<CategoryDto>.Ok(MapToDto(category));
    }

    public async Task<ApiResponse<CategoryDto>> CreateAsync(string name, string? description, int? parentCategoryId)
    {
        var category = new Category
        {
            Name = name,
            Description = description,
            ParentCategoryId = parentCategoryId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _categoryRepository.AddAsync(category);
        await _categoryRepository.SaveChangesAsync();

        return ApiResponse<CategoryDto>.Ok(MapToDto(category));
    }

    public async Task<ApiResponse<CategoryDto>> UpdateAsync(int id, string name, string? description)
    {
        var category = await _categoryRepository.GetByIdAsync(id);

        if (category is null)
            return ApiResponse<CategoryDto>.Fail("Category not found.");

        category.Name = name;
        category.Description = description;
        category.UpdatedAt = DateTime.UtcNow;

        _categoryRepository.Update(category);
        await _categoryRepository.SaveChangesAsync();

        return ApiResponse<CategoryDto>.Ok(MapToDto(category));
    }

    public async Task<ApiResponse> DeleteAsync(int id)
    {
        var category = await _categoryRepository.GetByIdAsync(id);

        if (category is null)
            return ApiResponse.Fail("Category not found.");

        _categoryRepository.SoftDelete(category);
        await _categoryRepository.SaveChangesAsync();

        return ApiResponse.Ok();
    }

    private static CategoryDto MapToDto(Category category) => new()
    {
        Id = category.Id,
        Name = category.Name,
        Description = category.Description,
        ParentCategoryId = category.ParentCategoryId,
        SubCategories = category.SubCategories.Select(MapToDto)
    };
}
