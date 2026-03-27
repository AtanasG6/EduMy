using EduMy.Domain.Entities.Users;

namespace EduMy.Application.Services.Auth.Interfaces;

public interface IJwtService
{
    string GenerateToken(User user);
}
