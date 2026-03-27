using EduMy.Domain.Common;
using EduMy.Domain.Entities.Courses;
using EduMy.Domain.Entities.Payments;
using EduMy.Domain.Entities.Quizzes;
using EduMy.Domain.Entities.Users;

namespace EduMy.Domain.Entities.Enrollments;

public class Enrollment : BaseEntity<int>
{
    public int StudentId { get; set; }
    public int CourseId { get; set; }
    public DateTime EnrolledAt { get; set; }
    public decimal ProgressPercent { get; set; }
    public bool IsCompleted { get; set; }
    public DateTime? CompletedAt { get; set; }
    public DateTime? LastAccessedAt { get; set; }

    public User Student { get; set; } = null!;
    public Course Course { get; set; } = null!;
    public Certificate? Certificate { get; set; }
    public ICollection<LectureProgress> LectureProgresses { get; set; } = [];
    public ICollection<QuizAttempt> QuizAttempts { get; set; } = [];
    public ICollection<Payment> Payments { get; set; } = [];
}
