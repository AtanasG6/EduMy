using EduMy.Application.Services.Payments.Interfaces;
using EduMy.Application.Services.Payments.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EduMy.Api.Controllers;

[Authorize]
public class PaymentsController : BaseApiController
{
    private readonly IPaymentService _paymentService;

    public PaymentsController(IPaymentService paymentService)
    {
        _paymentService = paymentService;
    }

    [HttpGet]
    public async Task<IActionResult> GetMy()
        => ToActionResult(await _paymentService.GetByStudentIdAsync(CurrentUserId));

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreatePaymentRequest request)
        => ToActionResult(await _paymentService.CreateAsync(CurrentUserId, request));
}
