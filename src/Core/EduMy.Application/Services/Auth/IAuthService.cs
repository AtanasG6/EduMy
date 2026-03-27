using EduMy.Application.Common;
using EduMy.Application.Services.Auth.DTOs;

namespace EduMy.Application.Services.Auth;

public interface IAuthService
{
    Task<ApiResponse<AuthResponse>> LoginAsync(LoginRequest request);
    Task<ApiResponse<AuthResponse>> RegisterAsync(RegisterRequest request);
}
