namespace EduMy.Application.Services.Payments.DTOs;

public class CreatePaymentRequest
{
    public int CourseId { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;
}
