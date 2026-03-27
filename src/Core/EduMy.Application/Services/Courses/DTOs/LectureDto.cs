namespace EduMy.Application.Services.Courses.DTOs;

public class LectureDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int OrderIndex { get; set; }
    public string? VideoUrl { get; set; }
    public string? DocumentUrl { get; set; }
    public int? DurationMinutes { get; set; }
}
