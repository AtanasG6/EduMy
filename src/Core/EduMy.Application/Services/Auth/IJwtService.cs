using EduMy.Domain.Entities.Users;

namespace EduMy.Application.Services.Auth;

public interface IJwtService
{
    string GenerateToken(User user);
}
