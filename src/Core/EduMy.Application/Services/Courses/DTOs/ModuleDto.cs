namespace EduMy.Application.Services.Courses.DTOs;

public class ModuleDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int OrderIndex { get; set; }
    public IEnumerable<LectureDto> Lectures { get; set; } = [];
}
