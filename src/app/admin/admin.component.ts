import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns'; 
import { Task } from './../task.model';
import { User } from '../user.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  title = 'Task Management System';
  currentDate: Date = new Date();
  weeks: Date[][] = [];

  newUser: User = {
    id: undefined,
    email: '',
    name: '',
    password: '',
    role: ''
  };

  newTask: Task = {
    id: undefined,
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    assignedTo: { id: 0,
      email: '',
    name: '',
    password: '',
    role:'USER'
    }
  };

  constructor(private http: HttpClient, private router: Router) {
    this.displayUser();
    this.displayTask();
    this.generateUserColors();
  }

  ngOnInit(): void {
    this.generateCalendar(this.currentDate);
  }

  // Checks if a date is today
  isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  // Generates the calendar for the current month
  generateCalendar(date: Date): void {
    const start = startOfWeek(startOfMonth(date));
    const end = endOfWeek(endOfMonth(date));
    const days = eachDayOfInterval({ start, end });
    this.weeks = this.chunkArray(days, 7);
  }

  // Navigates to the previous month
  goToPreviousMonth(): void {
    this.currentDate = subMonths(this.currentDate, 1);
    this.generateCalendar(this.currentDate);
  }

  // Navigates to the next month
  goToNextMonth(): void {
    this.currentDate = addMonths(this.currentDate, 1);
    this.generateCalendar(this.currentDate);
  }

  // Chunks array into smaller arrays
  chunkArray(arr: any[], size: number): any[] {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  }
isWeekend(date: Date): boolean {
  const day = new Date(date).getDay();
  return day === 0 || day === 6; // Sunday (0) or Saturday (6)
}

  isDateInRange(day: Date, start: string, end: string): boolean {
  const dayDate = new Date(day).setHours(0, 0, 0, 0);
  const startDate = new Date(start).setHours(0, 0, 0, 0);
  const endDate = new Date(end).setHours(0, 0, 0, 0);
  return dayDate >= startDate && dayDate <= endDate;
}

userColors: { [userId: number]: string } = {};

generateUserColors() {
  const colors = ['#ff9999', '#99ccff', '#ccffcc', '#ffcc99', '#c299ff', '#ffff99', '#66ffcc'];
  
  // Shuffle the color array
  const shuffledColors = [...colors].sort(() => 0.5 - Math.random());

  this.userColors = {}; // reset

  this.userList.forEach((user, index) => {
    if (user.id !== undefined) {
      this.userColors[user.id] = shuffledColors[index] || this.getRandomColor();
    }
  });

  console.log('Generated user colors:', this.userColors);
}
getRandomColor(): string {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


  api = 'http://ec2-54-165-190-22.compute-1.amazonaws.com:8080';

  // API call to save a user
  saveUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.api}/insertuser`, user);
  }

  @ViewChild('closeBtn') closeBtn!: ElementRef;

  
  // On submit of user form
  onSubmit(userForm: NgForm): void {
    if (userForm.valid) {
      this.saveUser(this.newUser).subscribe({
        next: (response) => {
          console.log('User saved successfully:', response);
          alert('User registered successfully!');
          userForm.resetForm();
          this.newUser = { email: '', name: '', password: '', role: '' };
          this.closeBtn.nativeElement.click();
          this.displayUser();
          this.router.navigate(['/admin']);
        },
        error: (err) => {
          console.error('Error saving user:', err);
        }
      });
    }
  }

  userList: User[] = [];

  // API call to get users
  displayUser(): void {
  this.http.get<User[]>(`${this.api}/displayuser`).subscribe({
    next: (data) => {
      this.userList = data;
      this.generateUserColors();  // Generate colors for each user
      console.log('Users loaded:', this.userList);
    },
    error: (err) => {
      console.error('Error loading users:', err);
    }
  });
}


  // API call to delete a user
  deleteUser(id: number): void {
    this.http.delete(`${this.api}/deleteuser/${id}`).subscribe({
      next: (data) => {
        alert("User deleted successfully");
        this.displayUser();
      },
      error: (err) => {
        console.error('Error deleting user:', err);
      }
    });
  }

  // API call to save a task
  saveTask(task: Task): Observable<Task> {
    return this.http.post<Task>(`${this.api}/inserttask`, task,{headers: { 'Content-Type': 'application/json' }});
  }

  // On submit of task form
  onSubmitTask(taskForm: NgForm): void {
    if (taskForm.valid) {
      const formattedTask: Task = {
        ...this.newTask,
       startDate: new Date(this.newTask.startDate).toISOString().split('.')[0],
endDate: new Date(this.newTask.endDate).toISOString().split('.')[0]
     // Correct ISO format
      };
  
      this.saveTask(formattedTask).subscribe({
        next: (response) => {
          console.log('Task saved successfully:', response);
          alert('Task saved successfully!');
          taskForm.resetForm();
          this.newTask = {
            id: undefined,
            title: '',
            description: '',
            startDate: '',
            endDate: '',
            assignedTo: { id: 0,
              email: '',
              name: '',
              password: '',
              role:'USER'
            }
          };
          
          this.displayTask();
          this.router.navigate(['/admin']);
        },
        error: (err) => {
          console.error('Error saving task:', err);
        }
      });
    }
  }

    taskList: Task[] = [];
  displayTask():void{
    this.http.get<Task[]>(`${this.api}/displaytask`).subscribe({
      next:(data)=>{
        this.taskList=data;
        console.log('Task Loaded:', this.taskList);
      },
      error:(err)=>{
        console.error('Error Loading task:',err);
      }
    });
  }


  
  deleteTask(id: number): void {
    this.http.delete(`${this.api}/deletetask/${id}`).subscribe({
      next: (data) => {
        alert("Task deleted successfully");
        this.displayTask();
      },
      error: (err) => {
        console.error('Error deleting usTasker:', err);
      }
    });
  }

  logout() {
  // Clear session or local storage
  sessionStorage.clear();
  localStorage.clear();

  // Navigate to home
  this.router.navigate(['']).then(() => {
    // Prevent going back
    history.pushState(null, '', location.href);
    window.onpopstate = function () {
      history.go(1);
    };
  });
}

}
