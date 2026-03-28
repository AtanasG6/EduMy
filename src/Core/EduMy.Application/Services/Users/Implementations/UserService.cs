using EduMy.Application.Services.Auth.Interfaces;
using EduMy.Application.Services.Users.Interfaces;
using EduMy.Application.Common;
using EduMy.Application.Repositories;
using EduMy.Application.Services.Auth;
using EduMy.Application.Services.Users.DTOs;
using EduMy.Domain.Entities.Users;

namespace EduMy.Application.Services.Users.Implementations;

public class UserService : IUserService
{
    private readonly IDeletableEntityRepository<User, int> _userRepository;
    private readonly IPasswordHasher _passwordHasher;

    public UserService(
        IDeletableEntityRepository<User, int> userRepository,
        IPasswordHasher passwordHasher)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
    }

    public async Task<ApiResponse<IEnumerable<UserDto>>> GetAllAsync()
    {
        var users = await _userRepository.GetAllAsync();
        return ApiResponse<IEnumerable<UserDto>>.Ok(users.Select(MapToDto));
    }

    public async Task<ApiResponse<UserDto>> GetByIdAsync(int id)
    {
        var user = await _userRepository.GetByIdAsync(id);

        if (user is null)
            return ApiResponse<UserDto>.Fail("User not found.");

        return ApiResponse<UserDto>.Ok(MapToDto(user));
    }

    public async Task<ApiResponse<UserDto>> UpdateAsync(int id, UpdateUserRequest request)
    {
        var user = await _userRepository.GetByIdAsync(id);

        if (user is null)
            return ApiResponse<UserDto>.Fail("User not found.");

        user.FirstName = request.FirstName;
        user.LastName = request.LastName;
        user.Bio = request.Bio;
        user.Specialization = request.Specialization;
        user.YearsOfExperience = request.YearsOfExperience;
        user.UpdatedAt = DateTime.UtcNow;

        _userRepository.Update(user);
        await _userRepository.SaveChangesAsync();

        return ApiResponse<UserDto>.Ok(MapToDto(user), "Profile updated.");
    }

    public async Task<ApiResponse> ChangePasswordAsync(int id, ChangePasswordRequest request)
    {
        var user = await _userRepository.GetByIdAsync(id);

        if (user is null)
            return ApiResponse.Fail("User not found.");

        if (!_passwordHasher.Verify(request.CurrentPassword, user.PasswordHash))
            return ApiResponse.Fail("Current password is incorrect.");

        user.PasswordHash = _passwordHasher.Hash(request.NewPassword);
        user.UpdatedAt = DateTime.UtcNow;

        _userRepository.Update(user);
        await _userRepository.SaveChangesAsync();

        return ApiResponse.Ok("Password changed successfully.");
    }

    public async Task<ApiResponse> BlockAsync(int id)
    {
        var user = await _userRepository.GetByIdAsync(id);

        if (user is null)
            return ApiResponse.Fail("User not found.");

        user.IsBlocked = true;
        user.UpdatedAt = DateTime.UtcNow;

        _userRepository.Update(user);
        await _userRepository.SaveChangesAsync();

        return ApiResponse.Ok("User blocked.");
    }

    public async Task<ApiResponse> UnblockAsync(int id)
    {
        var user = await _userRepository.GetByIdAsync(id);

        if (user is null)
            return ApiResponse.Fail("User not found.");

        user.IsBlocked = false;
        user.UpdatedAt = DateTime.UtcNow;

        _userRepository.Update(user);
        await _userRepository.SaveChangesAsync();

        return ApiResponse.Ok("User unblocked.");
    }

    public async Task<ApiResponse> DeleteAsync(int id)
    {
        var user = await _userRepository.GetByIdAsync(id);

        if (user is null)
            return ApiResponse.Fail("User not found.");

        _userRepository.SoftDelete(user);
        await _userRepository.SaveChangesAsync();

        return ApiResponse.Ok("User deleted.");
    }

    private static UserDto MapToDto(User user) => new()
    {
        Id = user.Id,
        Email = user.Email,
        FirstName = user.FirstName,
        LastName = user.LastName,
        Role = user.Role.ToString(),
        ProfilePictureUrl = user.ProfilePictureUrl,
        Bio = user.Bio,
        Specialization = user.Specialization,
        YearsOfExperience = user.YearsOfExperience,
        IsBlocked = user.IsBlocked
    };
}
