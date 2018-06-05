using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using ContosoUniversity.Data;
using ContosoUniversity.Models;
using ContosoUniversity.Models.SchoolViewModels;

namespace ContosoUniversity.Controllers
{
    public class InstructorsController : Controller
    {
        private readonly SchoolContext _context;

        public InstructorsController(SchoolContext context)
        {
            _context = context;
        }

        // GET: Instructors
        public async Task<IActionResult> Index(int? id, int? courseId)
        {
            // set to true to load the enrollment data up front, false to explicitly load enrollment data on demand.
            bool eargerLoading = false;
            var viewModel = new InstructorIndexData();

            if (eargerLoading)
            {
                viewModel.Instructors = await _context.Instructors
                    .Include(x => x.OfficeAssignment)
                    .Include(x => x.CourseAssignments)
                    .ThenInclude(x => x.Course)
                    .ThenInclude(x => x.Enrollments)
                    .ThenInclude(x => x.Student)
                    .Include(x => x.CourseAssignments)
                    .ThenInclude(x => x.Course)
                    .ThenInclude(x => x.Department)
                    .AsNoTracking()
                    .OrderBy(x => x.LastName)
                    .ToListAsync();
            }
            else
            {
                viewModel.Instructors = await _context.Instructors
                    .Include(x => x.OfficeAssignment)
                    .Include(x => x.CourseAssignments)
                    .ThenInclude(x => x.Course)
                    .ThenInclude(x => x.Department)
                    .OrderBy(x => x.LastName)
                    .ToListAsync();
            }

            if (id != null)
            {
                ViewData["InstructorID"] = id.Value;
                Instructor instructor = viewModel.Instructors.Single(
                    i => i.Id == id.Value);
                viewModel.Courses = instructor.CourseAssignments.Select(s => s.Course);
            }

            if (courseId != null)
            {
                ViewData["CourseID"] = courseId.Value;

                if (eargerLoading)
                {
                    viewModel.Enrollments = viewModel.Courses.Single(
                       x => x.CourseId == courseId).Enrollments;
                }
                else
                {
                    var selectedCourse = viewModel.Courses.Single(x => x.CourseId == courseId);
                    await _context.Entry(selectedCourse).Collection(x => x.Enrollments).LoadAsync();
                    foreach (Enrollment enrollment in selectedCourse.Enrollments)
                    {
                        await _context.Entry(enrollment).Reference(x => x.Student).LoadAsync();
                    }
                    viewModel.Enrollments = selectedCourse.Enrollments;
                }
            }

            return View(viewModel);
        }

        // GET: Instructors/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var instructor = await _context.Instructors
                .SingleOrDefaultAsync(m => m.Id == id);
            if (instructor == null)
            {
                return NotFound();
            }

            return View(instructor);
        }

        // GET: Instructors/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Instructors/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,LastName,FirstMidName,HireDate")] Instructor instructor)
        {
            if (ModelState.IsValid)
            {
                _context.Add(instructor);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(instructor);
        }

        // GET: Instructors/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var instructor = await _context.Instructors.SingleOrDefaultAsync(m => m.Id == id);
            if (instructor == null)
            {
                return NotFound();
            }
            return View(instructor);
        }

        // POST: Instructors/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,LastName,FirstMidName,HireDate")] Instructor instructor)
        {
            if (id != instructor.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(instructor);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!InstructorExists(instructor.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(instructor);
        }

        // GET: Instructors/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var instructor = await _context.Instructors
                .SingleOrDefaultAsync(m => m.Id == id);
            if (instructor == null)
            {
                return NotFound();
            }

            return View(instructor);
        }

        // POST: Instructors/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var instructor = await _context.Instructors.SingleOrDefaultAsync(m => m.Id == id);
            _context.Instructors.Remove(instructor);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool InstructorExists(int id)
        {
            return _context.Instructors.Any(e => e.Id == id);
        }
    }
}
