using EduMy.Domain.Common;

namespace EduMy.Domain.Entities;

public class Module : BaseEntity<int>
{
    public int CourseId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int OrderIndex { get; set; }

    public Course Course { get; set; } = null!;
    public ICollection<Lecture> Lectures { get; set; } = [];
    public Quiz? Quiz { get; set; }
}
