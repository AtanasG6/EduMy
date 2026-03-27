namespace EduMy.Application.Services.Users.DTOs;

public class UserDto
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string? ProfilePictureUrl { get; set; }
    public string? Bio { get; set; }
    public string? Specialization { get; set; }
    public int? YearsOfExperience { get; set; }
    public bool IsBlocked { get; set; }
}
