import { Component, OnInit } from '@angular/core';
import { addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns'; 
import { User } from './user.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router'; 
import { ViewChild, ElementRef } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {

  title='Task Management System';
}
