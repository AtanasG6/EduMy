using EduMy.Application.Services.Courses.Interfaces;
using EduMy.Application.Common;
using EduMy.Application.Repositories;
using EduMy.Application.Services.Courses.DTOs;
using EduMy.Domain.Entities.Courses;
using EduMy.Domain.Enums;

namespace EduMy.Application.Services.Courses.Implementations;

public class CourseService : ICourseService
{
    private readonly IDeletableEntityRepository<Course, int> _courseRepository;

    public CourseService(IDeletableEntityRepository<Course, int> courseRepository)
    {
        _courseRepository = courseRepository;
    }

    public async Task<ApiResponse<PagedResult<CourseDto>>> GetAllAsync(CourseFilterRequest filter)
    {
        var courses = await _courseRepository.FindAllAsync(c =>
            c.Status == CourseStatus.Published &&
            (filter.Search == null || c.Title.ToLower().Contains(filter.Search.ToLower())) &&
            (filter.CategoryId == null || c.CategoryId == filter.CategoryId) &&
            (filter.MinPrice == null || c.Price >= filter.MinPrice) &&
            (filter.MaxPrice == null || c.Price <= filter.MaxPrice),
            "Lecturer", "Category", "Enrollments", "Reviews");

        var totalCount = courses.Count;
        var items = courses
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .Select(MapToDto);

        return ApiResponse<PagedResult<CourseDto>>.Ok(new PagedResult<CourseDto>
        {
            Items = items,
            TotalCount = totalCount,
            Page = filter.Page,
            PageSize = filter.PageSize
        });
    }

    public async Task<ApiResponse<IEnumerable<CourseDto>>> GetMyAsync(int lecturerId)
    {
        var courses = await _courseRepository.FindAllAsync(c => c.LecturerId == lecturerId, "Lecturer", "Category", "Enrollments", "Reviews");
        return ApiResponse<IEnumerable<CourseDto>>.Ok(courses.Select(MapToDto));
    }

    public async Task<ApiResponse<CourseDto>> GetByIdAsync(int id)
    {
        var course = await _courseRepository.GetByIdAsync(id, "Lecturer", "Category", "Enrollments", "Reviews");

        if (course is null)
            return ApiResponse<CourseDto>.Fail("Course not found.");

        return ApiResponse<CourseDto>.Ok(MapToDto(course));
    }

    public async Task<ApiResponse<CourseDto>> CreateAsync(int lecturerId, CreateCourseRequest request)
    {
        var course = new Course
        {
            Title = request.Title,
            Description = request.Description,
            Price = request.Price,
            CategoryId = request.CategoryId,
            LecturerId = lecturerId,
            Status = CourseStatus.Draft,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _courseRepository.AddAsync(course);
        await _courseRepository.SaveChangesAsync();

        var created = await _courseRepository.GetByIdAsync(course.Id, "Lecturer", "Category", "Enrollments", "Reviews");
        return ApiResponse<CourseDto>.Ok(MapToDto(created!), "Course created.");
    }

    public async Task<ApiResponse<CourseDto>> UpdateAsync(int id, UpdateCourseRequest request)
    {
        var course = await _courseRepository.GetByIdAsync(id, "Lecturer", "Category", "Enrollments", "Reviews");

        if (course is null)
            return ApiResponse<CourseDto>.Fail("Course not found.");

        course.Title = request.Title;
        course.Description = request.Description;
        course.Price = request.Price;
        course.CategoryId = request.CategoryId;
        course.UpdatedAt = DateTime.UtcNow;

        _courseRepository.Update(course);
        await _courseRepository.SaveChangesAsync();

        return ApiResponse<CourseDto>.Ok(MapToDto(course), "Course updated.");
    }

    public async Task<ApiResponse> DeleteAsync(int id)
    {
        var course = await _courseRepository.GetByIdAsync(id);

        if (course is null)
            return ApiResponse.Fail("Course not found.");

        _courseRepository.SoftDelete(course);
        await _courseRepository.SaveChangesAsync();

        return ApiResponse.Ok("Course deleted.");
    }

    public async Task<ApiResponse> PublishAsync(int id)
    {
        var course = await _courseRepository.GetByIdAsync(id);

        if (course is null)
            return ApiResponse.Fail("Course not found.");

        course.Status = CourseStatus.Published;
        course.PublishedAt = DateTime.UtcNow;
        course.UpdatedAt = DateTime.UtcNow;

        _courseRepository.Update(course);
        await _courseRepository.SaveChangesAsync();

        return ApiResponse.Ok("Course published.");
    }

    public async Task<ApiResponse> ArchiveAsync(int id)
    {
        var course = await _courseRepository.GetByIdAsync(id);

        if (course is null)
            return ApiResponse.Fail("Course not found.");

        course.Status = CourseStatus.Archived;
        course.UpdatedAt = DateTime.UtcNow;

        _courseRepository.Update(course);
        await _courseRepository.SaveChangesAsync();

        return ApiResponse.Ok("Course archived.");
    }

    private static CourseDto MapToDto(Course course) => new()
    {
        Id = course.Id,
        Title = course.Title,
        Description = course.Description,
        CoverImageUrl = course.CoverImageUrl,
        Price = course.Price,
        Status = course.Status.ToString(),
        LecturerName = $"{course.Lecturer?.FirstName} {course.Lecturer?.LastName}".Trim(),
        CategoryName = course.Category?.Name ?? string.Empty,
        EnrollmentCount = course.Enrollments?.Count ?? 0,
        AverageRating = course.Reviews?.Any() == true
            ? course.Reviews.Average(r => r.Rating)
            : 0,
        PublishedAt = course.PublishedAt
    };
}
