namespace EduMy.Application.Services.Enrollments.DTOs;

public class EnrollmentDto
{
    public int Id { get; set; }
    public int CourseId { get; set; }
    public string CourseTitle { get; set; } = string.Empty;
    public string? CourseCoverImageUrl { get; set; }
    public decimal ProgressPercent { get; set; }
    public bool IsCompleted { get; set; }
    public DateTime EnrolledAt { get; set; }
    public DateTime? CompletedAt { get; set; }
}
