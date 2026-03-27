using EduMy.Domain.Common;
using EduMy.Domain.Entities.Courses;

namespace EduMy.Domain.Entities.Enrollments;

public class LectureProgress : BaseEntity<int>
{
    public int EnrollmentId { get; set; }
    public int LectureId { get; set; }
    public bool IsCompleted { get; set; }
    public DateTime? CompletedAt { get; set; }
    public int WatchTimeSeconds { get; set; }

    public Enrollment Enrollment { get; set; } = null!;
    public Lecture Lecture { get; set; } = null!;
}
