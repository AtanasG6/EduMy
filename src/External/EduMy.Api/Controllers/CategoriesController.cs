using EduMy.Application.Services.Courses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EduMy.Api.Controllers;

public class CategoriesController : BaseApiController
{
    private readonly ICategoryService _categoryService;

    public CategoriesController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
        => ToActionResult(await _categoryService.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
        => ToActionResult(await _categoryService.GetByIdAsync(id));

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CreateCategoryRequest request)
        => ToActionResult(await _categoryService.CreateAsync(request.Name, request.Description, request.ParentCategoryId));

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateCategoryRequest request)
        => ToActionResult(await _categoryService.UpdateAsync(id, request.Name, request.Description));

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
        => ToActionResult(await _categoryService.DeleteAsync(id));
}

public record CreateCategoryRequest(string Name, string? Description, int? ParentCategoryId);
public record UpdateCategoryRequest(string Name, string? Description);
