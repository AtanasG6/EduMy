namespace EduMy.Application.Services.Reviews.DTOs;

public class ReviewDto
{
    public int Id { get; set; }
    public int CourseId { get; set; }
    public string StudentName { get; set; } = string.Empty;
    public int Rating { get; set; }
    public string? Comment { get; set; }
    public DateTime CreatedAt { get; set; }
}
