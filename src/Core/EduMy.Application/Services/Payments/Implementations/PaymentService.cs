using EduMy.Application.Services.Payments.Interfaces;
using EduMy.Application.Common;
using EduMy.Application.Repositories;
using EduMy.Application.Services.Payments.DTOs;
using EduMy.Domain.Entities.Enrollments;
using EduMy.Domain.Entities.Payments;
using EduMy.Domain.Enums;

namespace EduMy.Application.Services.Payments.Implementations;

public class PaymentService : IPaymentService
{
    private readonly IRepository<Payment, int> _paymentRepository;
    private readonly IRepository<Enrollment, int> _enrollmentRepository;

    public PaymentService(
        IRepository<Payment, int> paymentRepository,
        IRepository<Enrollment, int> enrollmentRepository)
    {
        _paymentRepository = paymentRepository;
        _enrollmentRepository = enrollmentRepository;
    }

    public async Task<ApiResponse<PaymentDto>> CreateAsync(int studentId, CreatePaymentRequest request)
    {
        var enrollment = await _enrollmentRepository.FindAsync(
            e => e.StudentId == studentId && e.CourseId == request.CourseId);

        if (enrollment is null)
            return ApiResponse<PaymentDto>.Fail("Enrollment not found.");

        var payment = new Payment
        {
            EnrollmentId = enrollment.Id,
            Amount = 0,
            Currency = "USD",
            PaymentMethod = request.PaymentMethod,
            Status = PaymentStatus.Pending,
            CreatedAt = DateTime.UtcNow
        };

        await _paymentRepository.AddAsync(payment);
        await _paymentRepository.SaveChangesAsync();

        return ApiResponse<PaymentDto>.Ok(MapToDto(payment));
    }

    public async Task<ApiResponse<IEnumerable<PaymentDto>>> GetByStudentIdAsync(int studentId)
    {
        var enrollments = await _enrollmentRepository.FindAllAsync(e => e.StudentId == studentId);
        var enrollmentIds = enrollments.Select(e => e.Id).ToList();

        var payments = await _paymentRepository.FindAllAsync(p => enrollmentIds.Contains(p.EnrollmentId));

        return ApiResponse<IEnumerable<PaymentDto>>.Ok(payments.Select(MapToDto));
    }

    private static PaymentDto MapToDto(Payment payment) => new()
    {
        Id = payment.Id,
        Amount = payment.Amount,
        Currency = payment.Currency,
        Status = payment.Status.ToString(),
        PaymentMethod = payment.PaymentMethod,
        PaidAt = payment.PaidAt,
        CreatedAt = payment.CreatedAt
    };
}
