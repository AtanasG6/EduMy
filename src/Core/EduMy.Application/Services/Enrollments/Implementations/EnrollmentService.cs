using EduMy.Application.Services.Enrollments.Interfaces;
using EduMy.Application.Common;
using EduMy.Application.Repositories;
using EduMy.Application.Services.Enrollments.DTOs;
using EduMy.Domain.Entities.Courses;
using EduMy.Domain.Entities.Enrollments;

namespace EduMy.Application.Services.Enrollments.Implementations;

public class EnrollmentService : IEnrollmentService
{
    private readonly IRepository<Enrollment, int> _enrollmentRepository;
    private readonly IRepository<LectureProgress, int> _lectureProgressRepository;
    private readonly IRepository<Lecture, int> _lectureRepository;

    public EnrollmentService(
        IRepository<Enrollment, int> enrollmentRepository,
        IRepository<LectureProgress, int> lectureProgressRepository,
        IRepository<Lecture, int> lectureRepository)
    {
        _enrollmentRepository = enrollmentRepository;
        _lectureProgressRepository = lectureProgressRepository;
        _lectureRepository = lectureRepository;
    }

    public async Task<ApiResponse<IEnumerable<EnrollmentDto>>> GetByStudentIdAsync(int studentId)
    {
        var enrollments = await _enrollmentRepository.FindAllAsync(e => e.StudentId == studentId, "Course");
        return ApiResponse<IEnumerable<EnrollmentDto>>.Ok(enrollments.Select(MapToDto));
    }

    public async Task<ApiResponse<EnrollmentDto>> GetByIdAsync(int id)
    {
        var enrollment = await _enrollmentRepository.GetByIdAsync(id, "Course");

        if (enrollment is null)
            return ApiResponse<EnrollmentDto>.Fail("Enrollment not found.");

        return ApiResponse<EnrollmentDto>.Ok(MapToDto(enrollment));
    }

    public async Task<ApiResponse<EnrollmentDto>> EnrollAsync(int studentId, int courseId)
    {
        var alreadyEnrolled = await _enrollmentRepository.AnyAsync(
            e => e.StudentId == studentId && e.CourseId == courseId);

        if (alreadyEnrolled)
            return ApiResponse<EnrollmentDto>.Fail("Already enrolled in this course.");

        var enrollment = new Enrollment
        {
            StudentId = studentId,
            CourseId = courseId,
            EnrolledAt = DateTime.UtcNow,
            ProgressPercent = 0,
            IsCompleted = false
        };

        await _enrollmentRepository.AddAsync(enrollment);
        await _enrollmentRepository.SaveChangesAsync();

        return ApiResponse<EnrollmentDto>.Ok(MapToDto(enrollment));
    }

    public async Task<ApiResponse> MarkLectureCompleteAsync(int enrollmentId, int lectureId, int watchTimeSeconds)
    {
        var progress = await _lectureProgressRepository.FindAsync(
            lp => lp.EnrollmentId == enrollmentId && lp.LectureId == lectureId);

        if (progress is null)
        {
            progress = new LectureProgress
            {
                EnrollmentId = enrollmentId,
                LectureId = lectureId,
                IsCompleted = true,
                CompletedAt = DateTime.UtcNow,
                WatchTimeSeconds = watchTimeSeconds
            };
            await _lectureProgressRepository.AddAsync(progress);
        }
        else
        {
            progress.IsCompleted = true;
            progress.CompletedAt = DateTime.UtcNow;
            progress.WatchTimeSeconds = watchTimeSeconds;
            _lectureProgressRepository.Update(progress);
        }

        await _lectureProgressRepository.SaveChangesAsync();
        await UpdateProgressAsync(enrollmentId);

        return ApiResponse.Ok();
    }

    public async Task<ApiResponse> UpdateProgressAsync(int enrollmentId)
    {
        var enrollment = await _enrollmentRepository.GetByIdAsync(enrollmentId);

        if (enrollment is null)
            return ApiResponse.Fail("Enrollment not found.");

        var totalLectures = await _lectureRepository.CountAsync(
            l => l.Module.CourseId == enrollment.CourseId);

        var completedLectures = await _lectureProgressRepository.CountAsync(
            lp => lp.EnrollmentId == enrollmentId && lp.IsCompleted);

        enrollment.ProgressPercent = totalLectures > 0
            ? Math.Round((decimal)completedLectures / totalLectures * 100, 2)
            : 0;

        enrollment.IsCompleted = enrollment.ProgressPercent == 100;

        if (enrollment.IsCompleted && enrollment.CompletedAt is null)
            enrollment.CompletedAt = DateTime.UtcNow;

        enrollment.LastAccessedAt = DateTime.UtcNow;

        _enrollmentRepository.Update(enrollment);
        await _enrollmentRepository.SaveChangesAsync();

        return ApiResponse.Ok();
    }

    private static EnrollmentDto MapToDto(Enrollment enrollment) => new()
    {
        Id = enrollment.Id,
        CourseId = enrollment.CourseId,
        CourseTitle = enrollment.Course?.Title ?? string.Empty,
        CourseCoverImageUrl = enrollment.Course?.CoverImageUrl,
        ProgressPercent = enrollment.ProgressPercent,
        IsCompleted = enrollment.IsCompleted,
        EnrolledAt = enrollment.EnrolledAt,
        CompletedAt = enrollment.CompletedAt
    };
}
