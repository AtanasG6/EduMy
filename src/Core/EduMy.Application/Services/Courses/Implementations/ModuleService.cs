using EduMy.Application.Services.Courses.Interfaces;
using EduMy.Application.Common;
using EduMy.Application.Repositories;
using EduMy.Application.Services.Courses.DTOs;
using EduMy.Domain.Entities.Courses;

namespace EduMy.Application.Services.Courses.Implementations;

public class ModuleService : IModuleService
{
    private readonly IRepository<Module, int> _moduleRepository;

    public ModuleService(IRepository<Module, int> moduleRepository)
    {
        _moduleRepository = moduleRepository;
    }

    public async Task<ApiResponse<IEnumerable<ModuleDto>>> GetByCourseIdAsync(int courseId)
    {
        var modules = await _moduleRepository.FindAllAsync(m => m.CourseId == courseId, "Lectures", "Quiz");
        var ordered = modules.OrderBy(m => m.OrderIndex).Select(MapToDto);
        return ApiResponse<IEnumerable<ModuleDto>>.Ok(ordered);
    }

    public async Task<ApiResponse<ModuleDto>> CreateAsync(int courseId, string title, string? description)
    {
        var count = await _moduleRepository.CountAsync(m => m.CourseId == courseId);

        var module = new Module
        {
            CourseId = courseId,
            Title = title,
            Description = description,
            OrderIndex = count + 1
        };

        await _moduleRepository.AddAsync(module);
        await _moduleRepository.SaveChangesAsync();

        return ApiResponse<ModuleDto>.Ok(MapToDto(module));
    }

    public async Task<ApiResponse<ModuleDto>> UpdateAsync(int id, string title, string? description)
    {
        var module = await _moduleRepository.GetByIdAsync(id);

        if (module is null)
            return ApiResponse<ModuleDto>.Fail("Module not found.");

        module.Title = title;
        module.Description = description;

        _moduleRepository.Update(module);
        await _moduleRepository.SaveChangesAsync();

        return ApiResponse<ModuleDto>.Ok(MapToDto(module));
    }

    public async Task<ApiResponse> DeleteAsync(int id)
    {
        var module = await _moduleRepository.GetByIdAsync(id);

        if (module is null)
            return ApiResponse.Fail("Module not found.");

        _moduleRepository.Delete(module);
        await _moduleRepository.SaveChangesAsync();

        return ApiResponse.Ok();
    }

    public async Task<ApiResponse> ReorderAsync(int courseId, IEnumerable<int> orderedModuleIds)
    {
        var ids = orderedModuleIds.ToList();

        for (int i = 0; i < ids.Count; i++)
        {
            var module = await _moduleRepository.GetByIdAsync(ids[i]);
            if (module is null || module.CourseId != courseId) continue;

            module.OrderIndex = i + 1;
            _moduleRepository.Update(module);
        }

        await _moduleRepository.SaveChangesAsync();
        return ApiResponse.Ok();
    }

    private static ModuleDto MapToDto(Module module) => new()
    {
        Id = module.Id,
        Title = module.Title,
        Description = module.Description,
        OrderIndex = module.OrderIndex,
        QuizId = module.Quiz?.Id,
        Lectures = module.Lectures?.OrderBy(l => l.OrderIndex).Select(l => new LectureDto
        {
            Id = l.Id,
            Title = l.Title,
            Description = l.Description,
            OrderIndex = l.OrderIndex,
            VideoUrl = l.VideoUrl,
            DocumentUrl = l.DocumentUrl,
            DurationMinutes = l.DurationMinutes
        }) ?? []
    };
}
