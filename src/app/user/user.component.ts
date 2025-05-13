import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns'; 
import { Task } from './../task.model';
import { User } from '../user.model';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit{

  userId: string | null = null;
  title = 'Task Management System';
  currentDate: Date = new Date();
  weeks: Date[][] = [];
  
  constructor(private http: HttpClient, private router: Router) {
    
  }
   ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
  if (this.userId !== null) {
    const numericUserId = parseInt(this.userId, 10);
    this.displayTask(numericUserId);
  }
  this.generateCalendar(this.currentDate);
  }

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
  api = 'http://localhost:8080';
  
  taskList: Task[] = [];

  displayTask(id: number):void{
    this.http.get<Task[]>(`${this.api}/displaytaskbyassignedtoid/${id}`).subscribe({
      next:(data)=>{
        this.taskList=data;
        console.log('Task Loaded:', this.taskList);
        this.generateTaskColors();
      },
      error:(err)=>{
        console.error('Error Loading task:',err);
      }
    });
  }


 taskColors: { [userId: number]: string } = {};
generateTaskColors() {
  const colors = ['#ff9999', '#99ccff', '#ccffcc', '#ffcc99', '#c299ff', '#ffff99', '#66ffcc', '#ff66cc', '#66ccff', '#cc9966'];
  
  const shuffledColors = [...colors].sort(() => 0.5 - Math.random());

  this.taskColors = {}; // reset

  this.taskList.forEach((task, index) => {
    if (task.id !== undefined) {
      this.taskColors[task.id] = shuffledColors[index] || this.getRandomColor();
    }
  });

  console.log('Generated task colors:', this.taskColors);
}

getRandomColor(): string {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
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
