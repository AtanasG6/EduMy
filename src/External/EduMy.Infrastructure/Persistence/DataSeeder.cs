using EduMy.Domain.Entities.Courses;
using EduMy.Domain.Entities.Enrollments;
using EduMy.Domain.Entities.Users;
using EduMy.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace EduMy.Infrastructure.Persistence;

public static class DataSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        if (await context.Users.AnyAsync()) return;

        var now = DateTime.UtcNow;

        // Users
        var admin = new User
        {
            Email = "admin@edumy.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
            FirstName = "Admin",
            LastName = "EduMy",
            Role = UserRole.Admin,
            CreatedAt = now,
            UpdatedAt = now
        };

        var lecturer = new User
        {
            Email = "lecturer@edumy.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Lecturer123!"),
            FirstName = "Georgi",
            LastName = "Georgiev",
            Role = UserRole.Lecturer,
            Bio = "Senior software engineer with 10 years of experience.",
            Specialization = "Web Development",
            YearsOfExperience = 10,
            CreatedAt = now,
            UpdatedAt = now
        };

        var student = new User
        {
            Email = "student@edumy.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Student123!"),
            FirstName = "Ivan",
            LastName = "Ivanov",
            Role = UserRole.Student,
            CreatedAt = now,
            UpdatedAt = now
        };

        context.Users.AddRange(admin, lecturer, student);
        await context.SaveChangesAsync();

        // Categories
        var catProgramming = new Category { Name = "Programming", Description = "Learn to code", CreatedAt = now, UpdatedAt = now };
        var catWeb = new Category { Name = "Web Development", Description = "Frontend and backend web dev", CreatedAt = now, UpdatedAt = now };
        var catData = new Category { Name = "Data Science", Description = "Data analysis and ML", CreatedAt = now, UpdatedAt = now };
        var catDesign = new Category { Name = "Design", Description = "UI/UX and graphic design", CreatedAt = now, UpdatedAt = now };
        var catBusiness = new Category { Name = "Business", Description = "Entrepreneurship and management", CreatedAt = now, UpdatedAt = now };

        context.Categories.AddRange(catProgramming, catWeb, catData, catDesign, catBusiness);
        await context.SaveChangesAsync();

        // Courses
        var course1 = new Course
        {
            Title = "C# for Beginners",
            Description = "A complete introduction to C# programming. Learn variables, control flow, OOP, and more. Perfect for absolute beginners.",
            Price = 29.99m,
            Status = CourseStatus.Published,
            LecturerId = lecturer.Id,
            CategoryId = catProgramming.Id,
            PublishedAt = now,
            CreatedAt = now,
            UpdatedAt = now
        };

        var course2 = new Course
        {
            Title = "React from Zero to Hero",
            Description = "Build modern web applications with React. Covers hooks, routing, state management, and deploying to production.",
            Price = 49.99m,
            Status = CourseStatus.Published,
            LecturerId = lecturer.Id,
            CategoryId = catWeb.Id,
            PublishedAt = now,
            CreatedAt = now,
            UpdatedAt = now
        };

        var course3 = new Course
        {
            Title = "Introduction to Data Science",
            Description = "Explore the world of data. Learn Python, pandas, matplotlib, and machine learning basics.",
            Price = 39.99m,
            Status = CourseStatus.Published,
            LecturerId = lecturer.Id,
            CategoryId = catData.Id,
            PublishedAt = now,
            CreatedAt = now,
            UpdatedAt = now
        };

        var course4 = new Course
        {
            Title = "UI/UX Design Fundamentals",
            Description = "Design beautiful, user-friendly interfaces. Learn Figma, design principles, and user research techniques.",
            Price = 34.99m,
            Status = CourseStatus.Draft,
            LecturerId = lecturer.Id,
            CategoryId = catDesign.Id,
            CreatedAt = now,
            UpdatedAt = now
        };

        context.Courses.AddRange(course1, course2, course3, course4);
        await context.SaveChangesAsync();

        // Modules & Lectures for Course 1 (C#)
        var m1 = new Module { CourseId = course1.Id, Title = "Getting Started", OrderIndex = 1 };
        var m2 = new Module { CourseId = course1.Id, Title = "Object-Oriented Programming", OrderIndex = 2 };
        var m3 = new Module { CourseId = course1.Id, Title = "Advanced Topics", OrderIndex = 3 };
        context.Modules.AddRange(m1, m2, m3);
        await context.SaveChangesAsync();

        context.Lectures.AddRange(
            new Lecture { ModuleId = m1.Id, Title = "Installing .NET and Visual Studio", OrderIndex = 1, DurationMinutes = 10, Description ="In this lecture we set up the development environment." },
            new Lecture { ModuleId = m1.Id, Title = "Your First C# Program", OrderIndex = 2, DurationMinutes = 15, Description ="We write Hello World and understand the project structure." },
            new Lecture { ModuleId = m1.Id, Title = "Variables and Data Types", OrderIndex = 3, DurationMinutes = 20, Description ="Learn int, string, bool, double and more." },
            new Lecture { ModuleId = m2.Id, Title = "Classes and Objects", OrderIndex = 1, DurationMinutes = 25, Description ="Introduction to object-oriented programming." },
            new Lecture { ModuleId = m2.Id, Title = "Inheritance and Polymorphism", OrderIndex = 2, DurationMinutes = 30, Description ="Learn how to extend classes and override methods." },
            new Lecture { ModuleId = m2.Id, Title = "Interfaces and Abstractions", OrderIndex = 3, DurationMinutes = 25, Description ="Learn interfaces, abstract classes, and design patterns." },
            new Lecture { ModuleId = m3.Id, Title = "LINQ Basics", OrderIndex = 1, DurationMinutes = 20, Description ="Query collections with LINQ." },
            new Lecture { ModuleId = m3.Id, Title = "Async and Await", OrderIndex = 2, DurationMinutes = 25, Description ="Write asynchronous code with async/await." }
        );

        // Modules & Lectures for Course 2 (React)
        var m4 = new Module { CourseId = course2.Id, Title = "React Fundamentals", OrderIndex = 1 };
        var m5 = new Module { CourseId = course2.Id, Title = "State and Hooks", OrderIndex = 2 };
        var m6 = new Module { CourseId = course2.Id, Title = "Routing and APIs", OrderIndex = 3 };
        context.Modules.AddRange(m4, m5, m6);
        await context.SaveChangesAsync();

        context.Lectures.AddRange(
            new Lecture { ModuleId = m4.Id, Title = "What is React?", OrderIndex = 1, DurationMinutes = 10, Description ="Overview of React and the virtual DOM." },
            new Lecture { ModuleId = m4.Id, Title = "JSX and Components", OrderIndex = 2, DurationMinutes = 20, Description ="Create your first React components with JSX." },
            new Lecture { ModuleId = m4.Id, Title = "Props and Data Flow", OrderIndex = 3, DurationMinutes = 15, Description ="Pass data between components using props." },
            new Lecture { ModuleId = m5.Id, Title = "useState Hook", OrderIndex = 1, DurationMinutes = 20, Description ="Manage local component state." },
            new Lecture { ModuleId = m5.Id, Title = "useEffect Hook", OrderIndex = 2, DurationMinutes = 20, Description ="Handle side effects and lifecycle events." },
            new Lecture { ModuleId = m6.Id, Title = "React Router", OrderIndex = 1, DurationMinutes = 25, Description ="Add client-side routing to your app." },
            new Lecture { ModuleId = m6.Id, Title = "Fetching Data with Axios", OrderIndex = 2, DurationMinutes = 20, Description ="Consume REST APIs from React." }
        );

        // Modules & Lectures for Course 3 (Data Science)
        var m7 = new Module { CourseId = course3.Id, Title = "Python Basics", OrderIndex = 1 };
        var m8 = new Module { CourseId = course3.Id, Title = "Data Analysis", OrderIndex = 2 };
        context.Modules.AddRange(m7, m8);
        await context.SaveChangesAsync();

        context.Lectures.AddRange(
            new Lecture { ModuleId = m7.Id, Title = "Python Setup and Syntax", OrderIndex = 1, DurationMinutes = 15, Description ="Install Python and write your first script." },
            new Lecture { ModuleId = m7.Id, Title = "Lists, Dicts, and Loops", OrderIndex = 2, DurationMinutes = 20, Description ="Core Python data structures." },
            new Lecture { ModuleId = m8.Id, Title = "Introduction to Pandas", OrderIndex = 1, DurationMinutes = 25, Description ="Load and manipulate data with pandas DataFrames." },
            new Lecture { ModuleId = m8.Id, Title = "Visualizing Data with Matplotlib", OrderIndex = 2, DurationMinutes = 20, Description ="Create charts and graphs from your data." }
        );

        await context.SaveChangesAsync();

        // Enroll student in course 1
        var enrollment = new Enrollment
        {
            StudentId = student.Id,
            CourseId = course1.Id,
            EnrolledAt = now,
            ProgressPercent = 0,
            IsCompleted = false
        };
        context.Enrollments.Add(enrollment);
        await context.SaveChangesAsync();
    }
}
