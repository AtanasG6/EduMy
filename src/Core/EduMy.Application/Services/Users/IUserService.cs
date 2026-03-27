using EduMy.Application.Common;
using EduMy.Application.Services.Users.DTOs;

namespace EduMy.Application.Services.Users;

public interface IUserService
{
    Task<ApiResponse<UserDto>> GetByIdAsync(int id);
    Task<ApiResponse<UserDto>> UpdateAsync(int id, UpdateUserRequest request);
    Task<ApiResponse> ChangePasswordAsync(int id, ChangePasswordRequest request);
    Task<ApiResponse> BlockAsync(int id);
    Task<ApiResponse> UnblockAsync(int id);
    Task<ApiResponse> DeleteAsync(int id);
}
