using EduMy.Application.Services.Auth.Interfaces;
using EduMy.Application.Common;
using EduMy.Application.Repositories;
using EduMy.Application.Services.Auth.DTOs;
using EduMy.Domain.Entities.Users;
using EduMy.Domain.Enums;

namespace EduMy.Application.Services.Auth.Implementations;

public class AuthService : IAuthService
{
    private readonly IDeletableEntityRepository<User, int> _userRepository;
    private readonly IJwtService _jwtService;
    private readonly IPasswordHasher _passwordHasher;

    public AuthService(
        IDeletableEntityRepository<User, int> userRepository,
        IJwtService jwtService,
        IPasswordHasher passwordHasher)
    {
        _userRepository = userRepository;
        _jwtService = jwtService;
        _passwordHasher = passwordHasher;
    }

    public async Task<ApiResponse<AuthResponse>> LoginAsync(LoginRequest request)
    {
        var user = await _userRepository.FindAsync(u => u.Email == request.Email);

        if (user is null || !_passwordHasher.Verify(request.Password, user.PasswordHash))
            return ApiResponse<AuthResponse>.Fail("Invalid email or password.");

        if (user.IsBlocked)
            return ApiResponse<AuthResponse>.Fail("Your account has been blocked.");

        var token = _jwtService.GenerateToken(user);

        return ApiResponse<AuthResponse>.Ok(new AuthResponse
        {
            Token = token,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Role = user.Role.ToString()
        });
    }

    public async Task<ApiResponse<AuthResponse>> RegisterAsync(RegisterRequest request)
    {
        var exists = await _userRepository.AnyAsync(u => u.Email == request.Email);

        if (exists)
            return ApiResponse<AuthResponse>.Fail("Email is already in use.");

        var user = new User
        {
            Email = request.Email,
            PasswordHash = _passwordHasher.Hash(request.Password),
            FirstName = request.FirstName,
            LastName = request.LastName,
            Role = UserRole.Student,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _userRepository.AddAsync(user);
        await _userRepository.SaveChangesAsync();

        var token = _jwtService.GenerateToken(user);

        return ApiResponse<AuthResponse>.Ok(new AuthResponse
        {
            Token = token,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Role = user.Role.ToString()
        });
    }
}
