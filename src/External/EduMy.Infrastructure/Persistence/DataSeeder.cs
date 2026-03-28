using EduMy.Domain.Entities.Courses;
using EduMy.Domain.Entities.Enrollments;
using EduMy.Domain.Entities.Quizzes;
using EduMy.Domain.Entities.Reviews;
using EduMy.Domain.Entities.Users;
using EduMy.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace EduMy.Infrastructure.Persistence;

public static class DataSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        bool alreadySeeded = await context.Users.AnyAsync(u => u.Email == "admin@edumy.com");
        if (alreadySeeded) return;

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
            CoverImageUrl = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&fit=crop&auto=format&q=80",
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
            CoverImageUrl = "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&fit=crop&auto=format&q=80",
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
            CoverImageUrl = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&fit=crop&auto=format&q=80",
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
            CoverImageUrl = "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&fit=crop&auto=format&q=80",
            CreatedAt = now,
            UpdatedAt = now
        };

        var course5 = new Course
        {
            Title = "HTML & CSS Crash Course",
            Description = "Build websites from scratch using HTML5 and CSS3. Learn semantic markup, layouts, flexbox, and responsive design basics.",
            Price = 0m,
            Status = CourseStatus.Published,
            LecturerId = lecturer.Id,
            CategoryId = catWeb.Id,
            CoverImageUrl = "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&fit=crop&auto=format&q=80",
            PublishedAt = now,
            CreatedAt = now,
            UpdatedAt = now
        };

        context.Courses.AddRange(course1, course2, course3, course4, course5);
        await context.SaveChangesAsync();

        // Modules & Lectures for Course 1 (C#)
        var m1 = new Module { CourseId = course1.Id, Title = "Getting Started", OrderIndex = 1 };
        var m2 = new Module { CourseId = course1.Id, Title = "Object-Oriented Programming", OrderIndex = 2 };
        var m3 = new Module { CourseId = course1.Id, Title = "Advanced Topics", OrderIndex = 3 };
        context.Modules.AddRange(m1, m2, m3);
        await context.SaveChangesAsync();

        context.Lectures.AddRange(
            new Lecture { ModuleId = m1.Id, Title = "Installing .NET and Visual Studio", OrderIndex = 1, DurationMinutes = 10, Description = "In this lecture we set up the development environment.", VideoUrl = "https://www.youtube.com/embed/G1-Zfr9-3zs" },
            new Lecture { ModuleId = m1.Id, Title = "Your First C# Program", OrderIndex = 2, DurationMinutes = 15, Description = "We write Hello World and understand the project structure.", VideoUrl = "https://www.youtube.com/embed/gfkTfcpWqAY" },
            new Lecture { ModuleId = m1.Id, Title = "Variables and Data Types", OrderIndex = 3, DurationMinutes = 20, Description = "Learn int, string, bool, double and more.", VideoUrl = "https://www.youtube.com/embed/0QUgvfuKvWU" },
            new Lecture { ModuleId = m2.Id, Title = "Classes and Objects", OrderIndex = 1, DurationMinutes = 25, Description = "Introduction to object-oriented programming.", VideoUrl = "https://www.youtube.com/embed/ZqDtPFrUonQ" },
            new Lecture { ModuleId = m2.Id, Title = "Inheritance and Polymorphism", OrderIndex = 2, DurationMinutes = 30, Description = "Learn how to extend classes and override methods.", VideoUrl = "https://www.youtube.com/embed/9F9-EvW4RPk" },
            new Lecture { ModuleId = m2.Id, Title = "Interfaces and Abstractions", OrderIndex = 3, DurationMinutes = 25, Description = "Learn interfaces, abstract classes, and design patterns.", VideoUrl = "https://www.youtube.com/embed/A7qwuFnyIpM" },
            new Lecture { ModuleId = m3.Id, Title = "LINQ Basics", OrderIndex = 1, DurationMinutes = 20, Description = "Query collections with LINQ.", VideoUrl = "https://www.youtube.com/embed/5l2qA3Pc83M" },
            new Lecture { ModuleId = m3.Id, Title = "Async and Await", OrderIndex = 2, DurationMinutes = 25, Description = "Write asynchronous code with async/await.", VideoUrl = "https://www.youtube.com/embed/2moh18sh5p4" }
        );

        // Modules & Lectures for Course 2 (React)
        var m4 = new Module { CourseId = course2.Id, Title = "React Fundamentals", OrderIndex = 1 };
        var m5 = new Module { CourseId = course2.Id, Title = "State and Hooks", OrderIndex = 2 };
        var m6 = new Module { CourseId = course2.Id, Title = "Routing and APIs", OrderIndex = 3 };
        context.Modules.AddRange(m4, m5, m6);
        await context.SaveChangesAsync();

        context.Lectures.AddRange(
            new Lecture { ModuleId = m4.Id, Title = "What is React?", OrderIndex = 1, DurationMinutes = 10, Description = "Overview of React and the virtual DOM.", VideoUrl = "https://www.youtube.com/embed/Tn6-PIqc4UM" },
            new Lecture { ModuleId = m4.Id, Title = "JSX and Components", OrderIndex = 2, DurationMinutes = 20, Description = "Create your first React components with JSX.", VideoUrl = "https://www.youtube.com/embed/RVFAyFWO4go" },
            new Lecture { ModuleId = m4.Id, Title = "Props and Data Flow", OrderIndex = 3, DurationMinutes = 15, Description = "Pass data between components using props.", VideoUrl = "https://www.youtube.com/embed/PHaECbrKgs0" },
            new Lecture { ModuleId = m5.Id, Title = "useState Hook", OrderIndex = 1, DurationMinutes = 20, Description = "Manage local component state.", VideoUrl = "https://www.youtube.com/embed/O6P86uwfdR0" },
            new Lecture { ModuleId = m5.Id, Title = "useEffect Hook", OrderIndex = 2, DurationMinutes = 20, Description = "Handle side effects and lifecycle events.", VideoUrl = "https://www.youtube.com/embed/0ZJgIjIuY7U" },
            new Lecture { ModuleId = m6.Id, Title = "React Router", OrderIndex = 1, DurationMinutes = 25, Description = "Add client-side routing to your app.", VideoUrl = "https://www.youtube.com/embed/Ul3y1LXxzdU" },
            new Lecture { ModuleId = m6.Id, Title = "Fetching Data with Axios", OrderIndex = 2, DurationMinutes = 20, Description = "Consume REST APIs from React.", VideoUrl = "https://www.youtube.com/embed/6LyagkoRWYA" }
        );

        // Modules & Lectures for Course 3 (Data Science)
        var m7 = new Module { CourseId = course3.Id, Title = "Python Basics", OrderIndex = 1 };
        var m8 = new Module { CourseId = course3.Id, Title = "Data Analysis", OrderIndex = 2 };
        context.Modules.AddRange(m7, m8);
        await context.SaveChangesAsync();

        context.Lectures.AddRange(
            new Lecture { ModuleId = m7.Id, Title = "Python Setup and Syntax", OrderIndex = 1, DurationMinutes = 15, Description = "Install Python and write your first script.", VideoUrl = "https://www.youtube.com/embed/_uQrJ0TkZlc" },
            new Lecture { ModuleId = m7.Id, Title = "Lists, Dicts, and Loops", OrderIndex = 2, DurationMinutes = 20, Description = "Core Python data structures.", VideoUrl = "https://www.youtube.com/embed/kqtD5dpn9C8" },
            new Lecture { ModuleId = m8.Id, Title = "Introduction to Pandas", OrderIndex = 1, DurationMinutes = 25, Description = "Load and manipulate data with pandas DataFrames.", VideoUrl = "https://www.youtube.com/embed/vmEHCJofslg" },
            new Lecture { ModuleId = m8.Id, Title = "Visualizing Data with Matplotlib", OrderIndex = 2, DurationMinutes = 20, Description = "Create charts and graphs from your data.", VideoUrl = "https://www.youtube.com/embed/3Xc3CA655Y4" }
        );

        // Modules & Lectures for Course 5 (HTML & CSS) — MP4 videos via Video.js
        var m9 = new Module { CourseId = course5.Id, Title = "HTML Basics", OrderIndex = 1 };
        var m10 = new Module { CourseId = course5.Id, Title = "CSS Fundamentals", OrderIndex = 2 };
        context.Modules.AddRange(m9, m10);
        await context.SaveChangesAsync();

        context.Lectures.AddRange(
            new Lecture { ModuleId = m9.Id, Title = "What is HTML?", OrderIndex = 1, DurationMinutes = 8, Description = "Introduction to HyperText Markup Language and how browsers render pages.", VideoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" },
            new Lecture { ModuleId = m9.Id, Title = "Tags, Elements, and Attributes", OrderIndex = 2, DurationMinutes = 12, Description = "Understand the building blocks of every web page.", VideoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" },
            new Lecture { ModuleId = m9.Id, Title = "Semantic HTML5", OrderIndex = 3, DurationMinutes = 15, Description = "Use header, nav, main, section, article, and footer correctly.", VideoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" },
            new Lecture { ModuleId = m10.Id, Title = "CSS Selectors and Specificity", OrderIndex = 1, DurationMinutes = 18, Description = "Target elements with class, id, attribute, and pseudo-class selectors.", VideoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" },
            new Lecture { ModuleId = m10.Id, Title = "The Box Model", OrderIndex = 2, DurationMinutes = 14, Description = "Master margin, border, padding, and content sizing.", VideoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4" },
            new Lecture { ModuleId = m10.Id, Title = "Flexbox Layout", OrderIndex = 3, DurationMinutes = 20, Description = "Build one-dimensional layouts effortlessly with flexbox.", VideoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4" }
        );

        await context.SaveChangesAsync();

        // Quizzes for Course 1 modules
        var quiz1 = new Quiz { ModuleId = m1.Id, Title = "Getting Started Quiz", Description = "Test your knowledge of the C# development environment.", PassingScore = 60, OrderIndex = 1 };
        var quiz2 = new Quiz { ModuleId = m2.Id, Title = "OOP Quiz", Description = "Test your understanding of object-oriented programming.", PassingScore = 70, OrderIndex = 1 };
        var quiz3 = new Quiz { ModuleId = m4.Id, Title = "React Fundamentals Quiz", Description = "How well do you know React basics?", PassingScore = 60, OrderIndex = 1 };
        var quiz4 = new Quiz { ModuleId = m7.Id, Title = "Python Basics Quiz", Description = "Check your Python fundamentals.", PassingScore = 60, OrderIndex = 1 };
        var quiz5 = new Quiz { ModuleId = m9.Id, Title = "HTML Basics Quiz", Description = "Test your HTML knowledge.", PassingScore = 60, OrderIndex = 1 };
        context.Quizzes.AddRange(quiz1, quiz2, quiz3, quiz4, quiz5);
        await context.SaveChangesAsync();

        // Questions and Answers for quiz1
        var q1 = new Question { QuizId = quiz1.Id, Text = "What command creates a new .NET console app?", Type = QuestionType.MultipleChoice, Points = 1, OrderIndex = 1 };
        var q2 = new Question { QuizId = quiz1.Id, Text = "Which keyword is used to define a variable in C#?", Type = QuestionType.MultipleChoice, Points = 1, OrderIndex = 2 };
        var q3 = new Question { QuizId = quiz1.Id, Text = "What is the entry point of a C# program?", Type = QuestionType.MultipleChoice, Points = 1, OrderIndex = 3 };
        context.Questions.AddRange(q1, q2, q3);
        await context.SaveChangesAsync();

        context.Answers.AddRange(
            new Answer { QuestionId = q1.Id, Text = "dotnet new console", IsCorrect = true, OrderIndex = 1 },
            new Answer { QuestionId = q1.Id, Text = "dotnet create app", IsCorrect = false, OrderIndex = 2 },
            new Answer { QuestionId = q1.Id, Text = "csharp new project", IsCorrect = false, OrderIndex = 3 },
            new Answer { QuestionId = q1.Id, Text = "new-dotnet console", IsCorrect = false, OrderIndex = 4 },

            new Answer { QuestionId = q2.Id, Text = "var or explicit type", IsCorrect = true, OrderIndex = 1 },
            new Answer { QuestionId = q2.Id, Text = "let", IsCorrect = false, OrderIndex = 2 },
            new Answer { QuestionId = q2.Id, Text = "dim", IsCorrect = false, OrderIndex = 3 },
            new Answer { QuestionId = q2.Id, Text = "define", IsCorrect = false, OrderIndex = 4 },

            new Answer { QuestionId = q3.Id, Text = "The Main method", IsCorrect = true, OrderIndex = 1 },
            new Answer { QuestionId = q3.Id, Text = "The Start method", IsCorrect = false, OrderIndex = 2 },
            new Answer { QuestionId = q3.Id, Text = "The Run method", IsCorrect = false, OrderIndex = 3 },
            new Answer { QuestionId = q3.Id, Text = "The Init method", IsCorrect = false, OrderIndex = 4 }
        );

        // Questions and Answers for quiz2 (OOP)
        var q4 = new Question { QuizId = quiz2.Id, Text = "What does OOP stand for?", Type = QuestionType.MultipleChoice, Points = 1, OrderIndex = 1 };
        var q5 = new Question { QuizId = quiz2.Id, Text = "Which keyword is used to inherit a class in C#?", Type = QuestionType.MultipleChoice, Points = 1, OrderIndex = 2 };
        var q6 = new Question { QuizId = quiz2.Id, Text = "What is polymorphism?", Type = QuestionType.MultipleChoice, Points = 1, OrderIndex = 3 };
        context.Questions.AddRange(q4, q5, q6);
        await context.SaveChangesAsync();

        context.Answers.AddRange(
            new Answer { QuestionId = q4.Id, Text = "Object-Oriented Programming", IsCorrect = true, OrderIndex = 1 },
            new Answer { QuestionId = q4.Id, Text = "Object-Ordered Processing", IsCorrect = false, OrderIndex = 2 },
            new Answer { QuestionId = q4.Id, Text = "Open Object Programming", IsCorrect = false, OrderIndex = 3 },
            new Answer { QuestionId = q4.Id, Text = "Oriented Object Protocol", IsCorrect = false, OrderIndex = 4 },

            new Answer { QuestionId = q5.Id, Text = ": (colon)", IsCorrect = true, OrderIndex = 1 },
            new Answer { QuestionId = q5.Id, Text = "extends", IsCorrect = false, OrderIndex = 2 },
            new Answer { QuestionId = q5.Id, Text = "inherits", IsCorrect = false, OrderIndex = 3 },
            new Answer { QuestionId = q5.Id, Text = "base", IsCorrect = false, OrderIndex = 4 },

            new Answer { QuestionId = q6.Id, Text = "Objects of different types can be treated as the same base type", IsCorrect = true, OrderIndex = 1 },
            new Answer { QuestionId = q6.Id, Text = "A class can have multiple constructors", IsCorrect = false, OrderIndex = 2 },
            new Answer { QuestionId = q6.Id, Text = "Data is hidden inside a class", IsCorrect = false, OrderIndex = 3 },
            new Answer { QuestionId = q6.Id, Text = "A method can call itself", IsCorrect = false, OrderIndex = 4 }
        );

        // Questions and Answers for quiz3 (React)
        var q7 = new Question { QuizId = quiz3.Id, Text = "What does JSX stand for?", Type = QuestionType.MultipleChoice, Points = 1, OrderIndex = 1 };
        var q8 = new Question { QuizId = quiz3.Id, Text = "How do you pass data to a child component in React?", Type = QuestionType.MultipleChoice, Points = 1, OrderIndex = 2 };
        var q9 = new Question { QuizId = quiz3.Id, Text = "What is the virtual DOM?", Type = QuestionType.MultipleChoice, Points = 1, OrderIndex = 3 };
        context.Questions.AddRange(q7, q8, q9);
        await context.SaveChangesAsync();

        context.Answers.AddRange(
            new Answer { QuestionId = q7.Id, Text = "JavaScript XML", IsCorrect = true, OrderIndex = 1 },
            new Answer { QuestionId = q7.Id, Text = "Java Syntax Extension", IsCorrect = false, OrderIndex = 2 },
            new Answer { QuestionId = q7.Id, Text = "JavaScript Extension", IsCorrect = false, OrderIndex = 3 },
            new Answer { QuestionId = q7.Id, Text = "JSON XML", IsCorrect = false, OrderIndex = 4 },

            new Answer { QuestionId = q8.Id, Text = "Using props", IsCorrect = true, OrderIndex = 1 },
            new Answer { QuestionId = q8.Id, Text = "Using state", IsCorrect = false, OrderIndex = 2 },
            new Answer { QuestionId = q8.Id, Text = "Using context only", IsCorrect = false, OrderIndex = 3 },
            new Answer { QuestionId = q8.Id, Text = "Using refs", IsCorrect = false, OrderIndex = 4 },

            new Answer { QuestionId = q9.Id, Text = "An in-memory representation of the real DOM", IsCorrect = true, OrderIndex = 1 },
            new Answer { QuestionId = q9.Id, Text = "A database for UI components", IsCorrect = false, OrderIndex = 2 },
            new Answer { QuestionId = q9.Id, Text = "A browser plugin for React", IsCorrect = false, OrderIndex = 3 },
            new Answer { QuestionId = q9.Id, Text = "A virtual machine for JavaScript", IsCorrect = false, OrderIndex = 4 }
        );

        // Questions for quiz4 (Python)
        var q10 = new Question { QuizId = quiz4.Id, Text = "How do you print to the console in Python?", Type = QuestionType.MultipleChoice, Points = 1, OrderIndex = 1 };
        var q11 = new Question { QuizId = quiz4.Id, Text = "Which of these is a Python list?", Type = QuestionType.MultipleChoice, Points = 1, OrderIndex = 2 };
        context.Questions.AddRange(q10, q11);
        await context.SaveChangesAsync();

        context.Answers.AddRange(
            new Answer { QuestionId = q10.Id, Text = "print('Hello')", IsCorrect = true, OrderIndex = 1 },
            new Answer { QuestionId = q10.Id, Text = "console.log('Hello')", IsCorrect = false, OrderIndex = 2 },
            new Answer { QuestionId = q10.Id, Text = "echo 'Hello'", IsCorrect = false, OrderIndex = 3 },
            new Answer { QuestionId = q10.Id, Text = "System.out.println('Hello')", IsCorrect = false, OrderIndex = 4 },

            new Answer { QuestionId = q11.Id, Text = "[1, 2, 3]", IsCorrect = true, OrderIndex = 1 },
            new Answer { QuestionId = q11.Id, Text = "{1, 2, 3}", IsCorrect = false, OrderIndex = 2 },
            new Answer { QuestionId = q11.Id, Text = "(1, 2, 3)", IsCorrect = false, OrderIndex = 3 },
            new Answer { QuestionId = q11.Id, Text = "<1, 2, 3>", IsCorrect = false, OrderIndex = 4 }
        );

        await context.SaveChangesAsync();

        // Questions for quiz5 (HTML)
        var q12 = new Question { QuizId = quiz5.Id, Text = "What does HTML stand for?", Type = QuestionType.MultipleChoice, Points = 1, OrderIndex = 1 };
        var q13 = new Question { QuizId = quiz5.Id, Text = "Which tag is used for the largest heading?", Type = QuestionType.MultipleChoice, Points = 1, OrderIndex = 2 };
        var q14 = new Question { QuizId = quiz5.Id, Text = "Which HTML element defines the document body?", Type = QuestionType.MultipleChoice, Points = 1, OrderIndex = 3 };
        context.Questions.AddRange(q12, q13, q14);
        await context.SaveChangesAsync();

        context.Answers.AddRange(
            new Answer { QuestionId = q12.Id, Text = "HyperText Markup Language", IsCorrect = true, OrderIndex = 1 },
            new Answer { QuestionId = q12.Id, Text = "HyperText Management Language", IsCorrect = false, OrderIndex = 2 },
            new Answer { QuestionId = q12.Id, Text = "Home Tool Markup Language", IsCorrect = false, OrderIndex = 3 },
            new Answer { QuestionId = q12.Id, Text = "Hyperlink Text Markup Language", IsCorrect = false, OrderIndex = 4 },

            new Answer { QuestionId = q13.Id, Text = "<h1>", IsCorrect = true, OrderIndex = 1 },
            new Answer { QuestionId = q13.Id, Text = "<h6>", IsCorrect = false, OrderIndex = 2 },
            new Answer { QuestionId = q13.Id, Text = "<heading>", IsCorrect = false, OrderIndex = 3 },
            new Answer { QuestionId = q13.Id, Text = "<head>", IsCorrect = false, OrderIndex = 4 },

            new Answer { QuestionId = q14.Id, Text = "<body>", IsCorrect = true, OrderIndex = 1 },
            new Answer { QuestionId = q14.Id, Text = "<main>", IsCorrect = false, OrderIndex = 2 },
            new Answer { QuestionId = q14.Id, Text = "<content>", IsCorrect = false, OrderIndex = 3 },
            new Answer { QuestionId = q14.Id, Text = "<section>", IsCorrect = false, OrderIndex = 4 }
        );

        await context.SaveChangesAsync();

        // Reviews
        context.Set<Review>().AddRange(
            new Review { StudentId = student.Id, CourseId = course1.Id, Rating = 5, Comment = "Excellent course! Very clear explanations and well-structured content.", CreatedAt = now, UpdatedAt = now },
            new Review { StudentId = admin.Id,   CourseId = course1.Id, Rating = 4, Comment = "Great intro to C#. Would love more exercises.", CreatedAt = now, UpdatedAt = now },
            new Review { StudentId = student.Id, CourseId = course2.Id, Rating = 5, Comment = "Best React course I've taken. Hooks are explained perfectly.", CreatedAt = now, UpdatedAt = now },
            new Review { StudentId = admin.Id,   CourseId = course2.Id, Rating = 4, Comment = "Very practical and up to date. Highly recommend.", CreatedAt = now, UpdatedAt = now },
            new Review { StudentId = student.Id, CourseId = course3.Id, Rating = 4, Comment = "Solid introduction to data science. Pandas section was especially helpful.", CreatedAt = now, UpdatedAt = now },
            new Review { StudentId = admin.Id,   CourseId = course3.Id, Rating = 3, Comment = "Good content but could use more real-world examples.", CreatedAt = now, UpdatedAt = now },
            new Review { StudentId = student.Id, CourseId = course5.Id, Rating = 5, Comment = "Perfect for beginners. Loved the flexbox section!", CreatedAt = now, UpdatedAt = now },
            new Review { StudentId = admin.Id,   CourseId = course5.Id, Rating = 5, Comment = "Free and fantastic. The video quality is great.", CreatedAt = now, UpdatedAt = now }
        );
        await context.SaveChangesAsync();

        // Enroll student in course 1 and course 5
        context.Enrollments.AddRange(
            new Enrollment { StudentId = student.Id, CourseId = course1.Id, EnrolledAt = now, ProgressPercent = 0, IsCompleted = false },
            new Enrollment { StudentId = student.Id, CourseId = course5.Id, EnrolledAt = now, ProgressPercent = 0, IsCompleted = false }
        );
        await context.SaveChangesAsync();
    }
}
