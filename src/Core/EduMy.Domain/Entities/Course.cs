using EduMy.Domain.Common;
using EduMy.Domain.Enums;

namespace EduMy.Domain.Entities;

public class Course : BaseDeletableEntity<int>
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? CoverImageUrl { get; set; }
    public decimal Price { get; set; }
    public CourseStatus Status { get; set; }
    public int LecturerId { get; set; }
    public int CategoryId { get; set; }
    public DateTime? PublishedAt { get; set; }

    public User Lecturer { get; set; } = null!;
    public Category Category { get; set; } = null!;
    public ICollection<Module> Modules { get; set; } = [];
    public ICollection<Enrollment> Enrollments { get; set; } = [];
    public ICollection<Review> Reviews { get; set; } = [];
}
