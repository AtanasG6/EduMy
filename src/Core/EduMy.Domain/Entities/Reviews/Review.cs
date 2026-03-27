using EduMy.Domain.Common;
using EduMy.Domain.Entities.Courses;
using EduMy.Domain.Entities.Users;

namespace EduMy.Domain.Entities.Reviews;

public class Review : BaseDeletableEntity<int>
{
    public int StudentId { get; set; }
    public int CourseId { get; set; }
    public int Rating { get; set; }
    public string? Comment { get; set; }

    public User Student { get; set; } = null!;
    public Course Course { get; set; } = null!;
}
