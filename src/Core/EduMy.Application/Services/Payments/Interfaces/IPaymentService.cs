using EduMy.Application.Common;
using EduMy.Application.Services.Payments.DTOs;

namespace EduMy.Application.Services.Payments.Interfaces;

public interface IPaymentService
{
    Task<ApiResponse<PaymentDto>> CreateAsync(int studentId, CreatePaymentRequest request);
    Task<ApiResponse<IEnumerable<PaymentDto>>> GetByStudentIdAsync(int studentId);
}
