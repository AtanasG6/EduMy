namespace EduMy.Application.Services.Courses.DTOs;

public class CategoryDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int? ParentCategoryId { get; set; }
    public IEnumerable<CategoryDto> SubCategories { get; set; } = [];
}
