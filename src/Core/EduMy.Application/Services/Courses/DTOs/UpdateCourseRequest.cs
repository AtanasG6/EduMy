namespace EduMy.Application.Services.Courses.DTOs;

public class UpdateCourseRequest
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public int CategoryId { get; set; }
}
