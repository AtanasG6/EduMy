namespace EduMy.Application.Services.Reviews.DTOs;

public class CreateReviewRequest
{
    public int CourseId { get; set; }
    public int Rating { get; set; }
    public string? Comment { get; set; }
}
