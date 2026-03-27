namespace EduMy.Application.Services.Courses.DTOs;

public class CourseDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? CoverImageUrl { get; set; }
    public decimal Price { get; set; }
    public string Status { get; set; } = string.Empty;
    public string LecturerName { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public double AverageRating { get; set; }
    public int EnrollmentCount { get; set; }
    public DateTime? PublishedAt { get; set; }
}
