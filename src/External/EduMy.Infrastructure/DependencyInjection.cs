using EduMy.Application.Repositories;
using EduMy.Application.Services.Auth;
using EduMy.Application.Services.Courses;
using EduMy.Application.Services.Enrollments;
using EduMy.Application.Services.Payments;
using EduMy.Application.Services.Quizzes;
using EduMy.Application.Services.Reviews;
using EduMy.Application.Services.Users;
using EduMy.Domain.Common;
using EduMy.Infrastructure.Persistence;
using EduMy.Infrastructure.Persistence.Repositories;
using EduMy.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace EduMy.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped(typeof(IRepository<,>), typeof(Repository<,>));
        services.AddScoped(typeof(IDeletableEntityRepository<,>), typeof(DeletableEntityRepository<,>));

        services.AddScoped<IJwtService, JwtService>();
        services.AddScoped<IPasswordHasher, PasswordHasher>();

        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<ICourseService, CourseService>();
        services.AddScoped<ICategoryService, CategoryService>();
        services.AddScoped<IModuleService, ModuleService>();
        services.AddScoped<ILectureService, LectureService>();
        services.AddScoped<IEnrollmentService, EnrollmentService>();
        services.AddScoped<IReviewService, ReviewService>();
        services.AddScoped<IQuizService, QuizService>();
        services.AddScoped<IPaymentService, PaymentService>();

        return services;
    }
}
