using EduMy.Domain.Common;

namespace EduMy.Domain.Entities;

public class Category : BaseDeletableEntity<int>
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int? ParentCategoryId { get; set; }

    public Category? ParentCategory { get; set; }
    public ICollection<Category> SubCategories { get; set; } = [];
    public ICollection<Course> Courses { get; set; } = [];
}
