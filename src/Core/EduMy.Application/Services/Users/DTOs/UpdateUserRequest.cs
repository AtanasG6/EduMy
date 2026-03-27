namespace EduMy.Application.Services.Users.DTOs;

public class UpdateUserRequest
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? Bio { get; set; }
    public string? Specialization { get; set; }
    public int? YearsOfExperience { get; set; }
}
