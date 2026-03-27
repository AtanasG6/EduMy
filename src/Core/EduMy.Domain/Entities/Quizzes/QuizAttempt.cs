using EduMy.Domain.Common;
using EduMy.Domain.Entities.Enrollments;

namespace EduMy.Domain.Entities.Quizzes;

public class QuizAttempt : BaseEntity<int>
{
    public int EnrollmentId { get; set; }
    public int QuizId { get; set; }
    public int Score { get; set; }
    public bool IsPassed { get; set; }
    public DateTime AttemptedAt { get; set; }
    public DateTime? CompletedAt { get; set; }

    public Enrollment Enrollment { get; set; } = null!;
    public Quiz Quiz { get; set; } = null!;
}
