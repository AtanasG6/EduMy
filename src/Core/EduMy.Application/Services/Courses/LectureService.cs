using EduMy.Application.Common;
using EduMy.Application.Repositories;
using EduMy.Application.Services.Courses.DTOs;
using EduMy.Domain.Entities.Courses;

namespace EduMy.Application.Services.Courses;

public class LectureService : ILectureService
{
    private readonly IRepository<Lecture, int> _lectureRepository;

    public LectureService(IRepository<Lecture, int> lectureRepository)
    {
        _lectureRepository = lectureRepository;
    }

    public async Task<ApiResponse<LectureDto>> GetByIdAsync(int id)
    {
        var lecture = await _lectureRepository.GetByIdAsync(id);

        if (lecture is null)
            return ApiResponse<LectureDto>.Fail("Lecture not found.");

        return ApiResponse<LectureDto>.Ok(MapToDto(lecture));
    }

    public async Task<ApiResponse<LectureDto>> CreateAsync(int moduleId, LectureDto dto)
    {
        var count = await _lectureRepository.CountAsync(l => l.ModuleId == moduleId);

        var lecture = new Lecture
        {
            ModuleId = moduleId,
            Title = dto.Title,
            Description = dto.Description,
            VideoUrl = dto.VideoUrl,
            DocumentUrl = dto.DocumentUrl,
            DurationMinutes = dto.DurationMinutes,
            OrderIndex = count + 1
        };

        await _lectureRepository.AddAsync(lecture);
        await _lectureRepository.SaveChangesAsync();

        return ApiResponse<LectureDto>.Ok(MapToDto(lecture));
    }

    public async Task<ApiResponse<LectureDto>> UpdateAsync(int id, LectureDto dto)
    {
        var lecture = await _lectureRepository.GetByIdAsync(id);

        if (lecture is null)
            return ApiResponse<LectureDto>.Fail("Lecture not found.");

        lecture.Title = dto.Title;
        lecture.Description = dto.Description;
        lecture.VideoUrl = dto.VideoUrl;
        lecture.DocumentUrl = dto.DocumentUrl;
        lecture.DurationMinutes = dto.DurationMinutes;

        _lectureRepository.Update(lecture);
        await _lectureRepository.SaveChangesAsync();

        return ApiResponse<LectureDto>.Ok(MapToDto(lecture));
    }

    public async Task<ApiResponse> DeleteAsync(int id)
    {
        var lecture = await _lectureRepository.GetByIdAsync(id);

        if (lecture is null)
            return ApiResponse.Fail("Lecture not found.");

        _lectureRepository.Delete(lecture);
        await _lectureRepository.SaveChangesAsync();

        return ApiResponse.Ok();
    }

    public async Task<ApiResponse> ReorderAsync(int moduleId, IEnumerable<int> orderedLectureIds)
    {
        var ids = orderedLectureIds.ToList();

        for (int i = 0; i < ids.Count; i++)
        {
            var lecture = await _lectureRepository.GetByIdAsync(ids[i]);
            if (lecture is null || lecture.ModuleId != moduleId) continue;

            lecture.OrderIndex = i + 1;
            _lectureRepository.Update(lecture);
        }

        await _lectureRepository.SaveChangesAsync();
        return ApiResponse.Ok();
    }

    private static LectureDto MapToDto(Lecture lecture) => new()
    {
        Id = lecture.Id,
        Title = lecture.Title,
        Description = lecture.Description,
        OrderIndex = lecture.OrderIndex,
        VideoUrl = lecture.VideoUrl,
        DocumentUrl = lecture.DocumentUrl,
        DurationMinutes = lecture.DurationMinutes
    };
}
