using EduMy.Domain.Common;

namespace EduMy.Domain.Entities;

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
