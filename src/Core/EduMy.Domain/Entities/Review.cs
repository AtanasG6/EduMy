using EduMy.Domain.Common;

namespace EduMy.Domain.Entities;

public class Review : BaseDeletableEntity<int>
{
    public int StudentId { get; set; }
    public int CourseId { get; set; }
    public int Rating { get; set; }
    public string? Comment { get; set; }

    public User Student { get; set; } = null!;
    public Course Course { get; set; } = null!;
}
