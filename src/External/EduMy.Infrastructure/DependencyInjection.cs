using EduMy.Application.Repositories;
using EduMy.Application.Services.Diplomas.Interfaces;
using EduMy.Application.Services.Auth.Implementations;
using EduMy.Application.Services.Auth.Interfaces;
using EduMy.Application.Services.Courses.Implementations;
using EduMy.Application.Services.Courses.Interfaces;
using EduMy.Application.Services.Enrollments.Implementations;
using EduMy.Application.Services.Enrollments.Interfaces;
using EduMy.Application.Services.Payments.Implementations;
using EduMy.Application.Services.Payments.Interfaces;
using EduMy.Application.Services.Quizzes.Implementations;
using EduMy.Application.Services.Quizzes.Interfaces;
using EduMy.Application.Services.Reviews.Implementations;
using EduMy.Application.Services.Reviews.Interfaces;
using EduMy.Application.Services.Users.Implementations;
using EduMy.Application.Services.Users.Interfaces;
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

        services.AddHttpClient<IDiplomaVerificationService, OllamaVerificationService>(client =>
        {
            client.BaseAddress = new Uri("http://localhost:11434/");
            client.Timeout = TimeSpan.FromSeconds(120);
        });

        return services;
    }
}
